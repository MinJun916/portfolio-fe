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
    <div className="admin-page">
      <header className="admin-page-heading">
        <div className="admin-page-header">
          <p className="admin-eyebrow">콘텐츠 관리</p>
          <h1 className="admin-title">{RESOURCE_LABELS[resource]}</h1>
          <p className="admin-muted">공개 상태와 표시 순서를 관리합니다.</p>
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
          <div className="admin-list-summary">
            <p>
              전체 <strong>{query.data.length}</strong>개
            </p>
            <p className="admin-muted">위에서부터 포트폴리오에 표시됩니다.</p>
          </div>
          {query.data.length === 0 ? (
            <div className="admin-card admin-empty-state">
              <Plus size={24} aria-hidden="true" />
              <h2 className="font-medium">아직 콘텐츠가 없습니다.</h2>
              <p className="admin-muted">새 콘텐츠 버튼으로 첫 콘텐츠를 만들어보세요.</p>
            </div>
          ) : (
            <ul className="admin-content-list">
              {query.data.map((item, index) => (
                <li className="admin-content-row" key={item.id}>
                  <span className="admin-content-order" aria-label={`표시 순서 ${index + 1}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="admin-content-details">
                    <Link className="admin-content-title" href={`/admin/${resource}/${item.id}`}>
                      {item.title}
                    </Link>
                    <p className="admin-content-meta">
                      {new Date(item.updatedAt).toLocaleDateString('ko-KR')} 수정 · v{item.version}
                    </p>
                  </div>
                  <div className="admin-content-actions">
                    <button
                      className="admin-button-secondary admin-publish-button"
                      data-published={item.isPublished}
                      disabled={busy}
                      aria-label={`${item.title} ${item.isPublished ? '비공개로 변경' : '공개로 변경'}`}
                      onClick={() =>
                        publish.mutate(
                          { id: item.id, version: item.version, isPublished: !item.isPublished },
                          feedback,
                        )
                      }
                    >
                      <span className="admin-status-dot" aria-hidden="true" />
                      {item.isPublished ? '공개 중' : '비공개'}
                    </button>
                    <div
                      className="admin-reorder"
                      role="group"
                      aria-label={`${item.title} 표시 순서`}
                    >
                      <button
                        className="admin-button-secondary admin-icon-button"
                        aria-label={`${item.title} 위로 이동`}
                        disabled={busy || index === 0}
                        onClick={() => move(index, -1)}
                      >
                        <ArrowUp size={16} aria-hidden="true" />
                      </button>
                      <button
                        className="admin-button-secondary admin-icon-button"
                        aria-label={`${item.title} 아래로 이동`}
                        disabled={busy || index === query.data.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        <ArrowDown size={16} aria-hidden="true" />
                      </button>
                    </div>
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
