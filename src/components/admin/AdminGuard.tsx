'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAdminAuth, useAdminLogout } from '@/hooks/useAdminAuth';
import { getToken } from '@/lib/admin-session';
import { apiError } from '@/lib/api';

import AdminShell from './AdminShell';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAdminAuth();
  const logout = useAdminLogout();
  useEffect(() => {
    if (!session.token && !getToken())
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [session.token, pathname, router]);
  if (!session.token || session.isPending) {
    return (
      <div className="admin-status" role="status">
        로그인 상태를 확인하고 있습니다.
      </div>
    );
  }
  if (session.isError) {
    return (
      <div className="admin-status">
        <h1>로그인 상태를 확인하지 못했습니다.</h1>
        <p className="admin-error" role="alert">
          {apiError(session.error)}
        </p>
        <div className="admin-actions">
          <button
            className="admin-button"
            onClick={() => void session.refetch()}
            disabled={session.isFetching}
          >
            다시 시도
          </button>
          <button
            className="admin-button-secondary"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            로그아웃
          </button>
        </div>
        {logout.isError && (
          <p className="admin-error" role="alert">
            {apiError(logout.error)}
          </p>
        )}
      </div>
    );
  }
  if (!session.data) return null;
  return <AdminShell admin={session.data}>{children}</AdminShell>;
}
