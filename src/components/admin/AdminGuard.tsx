'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getToken } from '@/lib/admin-session';

import AdminShell from './AdminShell';
import { AdminSpinner } from './AdminSpinner';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAdminAuth();
  useEffect(() => {
    if (!session.token && !getToken())
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [session.token, pathname, router]);
  if (!session.token) {
    return (
      <div className="admin-status" role="status">
        <AdminSpinner />
        로그인 상태를 확인하고 있습니다.
      </div>
    );
  }
  return <AdminShell key={session.token}>{children}</AdminShell>;
}
