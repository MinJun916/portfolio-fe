import { CircleAlert } from 'lucide-react';

import { apiError } from '@/lib/api';

import { AdminSpinner } from './AdminSpinner';

export function QueryStatus({
  error,
  retry,
  pending = false,
  label = '콘텐츠를 불러오는 중입니다…',
}: {
  error?: unknown;
  retry?: () => void;
  pending?: boolean;
  label?: string;
}) {
  return (
    <div className="admin-card admin-query-status" role={error ? 'alert' : 'status'}>
      <div className="admin-status-icon">
        {error ? <CircleAlert size={22} aria-hidden="true" /> : <AdminSpinner />}
      </div>
      <div>
        <p className="font-semibold">{error ? '콘텐츠를 불러오지 못했습니다.' : label}</p>
        <p className="admin-muted mt-1 whitespace-pre-wrap">
          {error ? apiError(error) : '잠시만 기다려주세요.'}
        </p>
        {Boolean(error) && retry && (
          <button
            className="admin-button admin-button-secondary mt-4"
            onClick={retry}
            disabled={pending}
          >
            {pending && <AdminSpinner />}
            {pending ? '다시 불러오는 중…' : '다시 시도'}
          </button>
        )}
      </div>
    </div>
  );
}
