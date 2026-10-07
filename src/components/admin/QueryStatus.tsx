import { apiError } from '@/lib/api';

export function QueryStatus({ error, retry }: { error?: unknown; retry?: () => void }) {
  return (
    <div className="admin-card" role={error ? 'alert' : 'status'}>
      <p className="whitespace-pre-wrap">
        {error ? apiError(error) : '콘텐츠를 불러오는 중입니다…'}
      </p>
      {Boolean(error) && retry && (
        <button className="admin-button admin-button-secondary mt-4" onClick={retry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
