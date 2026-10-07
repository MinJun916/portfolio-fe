'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ContentFields } from '@/components/admin/ContentFields';
import { QueryStatus } from '@/components/admin/QueryStatus';
import { RESOURCE_LABELS } from '@/constants/admin';
import { EMPTY_CONTENT } from '@/constants/admin-fields';
import { useContentDetail, useSaveContent } from '@/hooks/useAdmin';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { apiError } from '@/lib/api';

import type { ContentMap, InputMap, Resource } from '@/types/admin';

export default function ContentEditor({ resource, id }: { resource: Resource; id: string }) {
  const query = useContentDetail(resource, id);
  const [reloadCount, setReloadCount] = useState(0);
  if (id !== 'new' && query.isPending) return <QueryStatus />;
  if (id !== 'new' && query.isError && !query.data)
    return <QueryStatus error={query.error} retry={() => void query.refetch()} />;
  return (
    <Editor
      key={`${resource}:${id}:${query.data?.version ?? 'new'}:${reloadCount}`}
      resource={resource}
      id={id}
      record={query.data}
      reload={() =>
        void query.refetch().then((result) => {
          if (result.isSuccess) setReloadCount((count) => count + 1);
          else toast.error(apiError(result.error));
        })
      }
    />
  );
}

function Editor({
  resource,
  id,
  record,
  reload,
}: {
  resource: Resource;
  id: string;
  record?: ContentMap[Resource];
  reload: () => void;
}) {
  const router = useRouter();
  const initial = record
    ? (() => {
        const {
          id: _id,
          version: _version,
          createdAt: _created,
          updatedAt: _updated,
          ...input
        } = record;
        void _id;
        void _version;
        void _created;
        void _updated;
        return input;
      })()
    : EMPTY_CONTENT[resource];
  const [input, setInput] = useState<InputMap[Resource]>(() => structuredClone(initial));
  const [saved, setSaved] = useState(false);
  const save = useSaveContent(resource, id);
  const dirty = !saved && JSON.stringify(input) !== JSON.stringify(initial);
  useUnsavedChanges(dirty);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (save.isPending) return;
        save.mutate(
          { input, version: record?.version },
          {
            onSuccess: (result) => {
              setSaved(true);
              toast.success('콘텐츠를 저장했습니다.');
              if (id === 'new') router.replace(`/admin/${resource}/${result.id}`);
            },
          },
        );
      }}
    >
      <header>
        <Link className="text-sm text-stone-500 hover:underline" href={`/admin/${resource}`}>
          ← {RESOURCE_LABELS[resource]} 목록
        </Link>
        <h1 className="admin-title mt-3">
          {RESOURCE_LABELS[resource]} {id === 'new' ? '생성' : '수정'}
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          {record
            ? `현재 버전 ${record.version} · 변경사항을 저장하면 반영됩니다.`
            : '새 콘텐츠는 기본적으로 비공개입니다.'}
        </p>
      </header>
      <fieldset disabled={save.isPending}>
        <ContentFields
          kind={resource}
          value={input}
          onChange={(value) => {
            setInput(value);
            setSaved(false);
          }}
          editing={id !== 'new'}
        />
      </fieldset>
      {save.isError && (
        <div className="admin-card" role="alert">
          <p className="text-sm whitespace-pre-wrap text-red-700">{apiError(save.error)}</p>
          {id !== 'new' && (
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
          )}
        </div>
      )}
      <div className="admin-savebar flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500" role="status">
          {save.isPending
            ? '저장 중…'
            : dirty
              ? '저장하지 않은 변경사항이 있습니다.'
              : id === 'new'
                ? '새 콘텐츠 내용을 입력해주세요.'
                : '모든 변경사항이 저장되었습니다.'}
        </p>
        <button
          className="admin-button"
          type="submit"
          disabled={save.isPending || (id !== 'new' && !dirty)}
        >
          {save.isPending ? '저장 중…' : id === 'new' ? '콘텐츠 생성' : '변경사항 저장'}
        </button>
      </div>
    </form>
  );
}
