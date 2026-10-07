'use client';

import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import ConfirmDelete from '@/components/admin/ConfirmDelete';
import { QueryStatus } from '@/components/admin/QueryStatus';
import { RESOURCE_LABELS } from '@/constants/admin';
import { useContentActions, useContentList } from '@/hooks/useAdmin';
import { apiError } from '@/lib/api';

import type { Resource } from '@/types/admin';

export default function ContentList({ resource }: { resource: Resource }) {
  const query = useContentList(resource);
  const { remove, reorder, publish } = useContentActions(resource);
  const busy = remove.isPending || reorder.isPending || publish.isPending;
  const feedback = { onError: (error: unknown) => toast.error(apiError(error)) };

  function move(index: number, direction: number) {
    const items = [...(query.data ?? [])];
    [items[index], items[index + direction]] = [items[index + direction], items[index]];
    reorder.mutate(
      items.map(({ id, version }) => ({ id, version })),
      feedback,
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="admin-eyebrow">CONTENT</p>
          <h1 className="admin-title">{RESOURCE_LABELS[resource]}</h1>
          <p className="mt-2 text-sm text-stone-500">공개 상태와 표시 순서를 관리합니다.</p>
        </div>
        <Link className="admin-button" href={`/admin/${resource}/new`}>
          <Plus size={16} aria-hidden />새 콘텐츠
        </Link>
      </header>
      {query.isPending ? (
        <QueryStatus />
      ) : query.isError ? (
        <QueryStatus error={query.error} retry={() => void query.refetch()} />
      ) : (
        <>
          <p className="text-sm text-stone-500">전체 {query.data.length}개</p>
          {query.data.length === 0 ? (
            <div className="admin-card py-12 text-center">
              <h2 className="font-medium">아직 콘텐츠가 없습니다.</h2>
              <p className="mt-2 text-sm text-stone-500">첫 콘텐츠를 만들어보세요.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {query.data.map((item, index) => (
                <li className="admin-card flex flex-wrap items-center gap-4" key={item.id}>
                  <div className="min-w-0 flex-1 basis-48">
                    <Link
                      className="font-semibold break-words hover:underline"
                      href={`/admin/${resource}/${item.id}`}
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-stone-500">
                      {new Date(item.updatedAt).toLocaleDateString('ko-KR')} 수정 · v{item.version}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="admin-button admin-button-secondary"
                      disabled={busy}
                      aria-label={`${item.title} ${item.isPublished ? '비공개로 변경' : '공개로 변경'}`}
                      onClick={() =>
                        publish.mutate(
                          { id: item.id, version: item.version, isPublished: !item.isPublished },
                          feedback,
                        )
                      }
                    >
                      {item.isPublished ? '공개' : '비공개'}
                    </button>
                    <button
                      className="admin-button admin-button-secondary"
                      aria-label={`${item.title} 위로 이동`}
                      disabled={busy || index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="admin-button admin-button-secondary"
                      aria-label={`${item.title} 아래로 이동`}
                      disabled={busy || index === query.data.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <Link
                      className="admin-button admin-button-secondary"
                      href={`/admin/${resource}/${item.id}`}
                    >
                      수정
                    </Link>
                    <ConfirmDelete
                      title={item.title}
                      pending={busy}
                      onConfirm={() =>
                        remove.mutate(
                          { id: item.id, version: item.version },
                          { ...feedback, onSuccess: () => toast.success('콘텐츠를 삭제했습니다.') },
                        )
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {(remove.isError || reorder.isError || publish.isError) && (
            <div role="alert" className="admin-card text-sm">
              <p className="whitespace-pre-wrap">
                {apiError(remove.error ?? reorder.error ?? publish.error)}
              </p>
              <button
                className="admin-button admin-button-secondary mt-3"
                onClick={() => {
                  remove.reset();
                  reorder.reset();
                  publish.reset();
                  void query.refetch();
                }}
              >
                최신 목록 다시 불러오기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
