'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { ContentFields } from '@/components/admin/ContentFields';
import { QueryStatus } from '@/components/admin/QueryStatus';
import { useSaveSite, useSite } from '@/hooks/useAdmin';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { apiError } from '@/lib/api';

import type { Site, SiteData } from '@/types/admin';

export default function SiteEditor() {
  const query = useSite();
  const [reloadCount, setReloadCount] = useState(0);
  if (query.isPending) return <QueryStatus />;
  if (query.isError && !query.data)
    return <QueryStatus error={query.error} retry={() => void query.refetch()} />;
  if (!query.data) return null;
  return (
    <Form
      key={`${query.data.version}:${reloadCount}`}
      site={query.data}
      reload={() =>
        void query.refetch().then((result) => {
          if (result.isSuccess) setReloadCount((count) => count + 1);
          else toast.error(apiError(result.error));
        })
      }
    />
  );
}

function Form({ site, reload }: { site: Site; reload: () => void }) {
  const [data, setData] = useState(site.data);
  const save = useSaveSite();
  const dirty = JSON.stringify(data) !== JSON.stringify(site.data);
  useUnsavedChanges(dirty);
  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!save.isPending)
          save.mutate(
            { version: site.version, data },
            { onSuccess: () => toast.success('사이트 콘텐츠를 저장했습니다.') },
          );
      }}
    >
      <header>
        <p className="admin-eyebrow">SITE</p>
        <h1 className="admin-title">사이트 콘텐츠</h1>
        <p className="mt-2 text-sm text-stone-500">
          프로필, 소개, 섹션 문구와 검색 정보를 관리합니다.
        </p>
      </header>
      <fieldset disabled={save.isPending}>
        <ContentFields kind="site" value={data} onChange={(value) => setData(value as SiteData)} />
      </fieldset>
      {save.isError && (
        <div className="admin-card" role="alert">
          <p className="text-sm whitespace-pre-wrap text-red-700">{apiError(save.error)}</p>
          <button
            className="admin-button admin-button-secondary mt-3"
            type="button"
            onClick={() => {
              if (window.confirm('입력한 변경사항을 버리고 최신 콘텐츠를 불러올까요?')) {
                save.reset();
                reload();
              }
            }}
          >
            최신 콘텐츠 불러오기
          </button>
        </div>
      )}
      <div className="admin-savebar flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500" role="status">
          {dirty ? '저장하지 않은 변경사항이 있습니다.' : `현재 버전 ${site.version}`}
        </p>
        <button className="admin-button" disabled={!dirty || save.isPending}>
          {save.isPending ? '저장 중…' : '변경사항 저장'}
        </button>
      </div>
    </form>
  );
}
