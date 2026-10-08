'use client';

import {
  BriefcaseBusiness,
  FolderOpen,
  Globe,
  KeyRound,
  LayoutDashboard,
  Layers,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAdminLogout } from '@/hooks/useAdminAuth';
import { apiError } from '@/lib/api';

import type { Admin } from '@/types/admin';

const navigation = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/site', label: '사이트', icon: Globe },
  { href: '/admin/projects', label: '프로젝트', icon: FolderOpen },
  { href: '/admin/experiences', label: '경험', icon: BriefcaseBusiness },
  { href: '/admin/tech-groups', label: '기술 스택', icon: Layers },
  { href: '/admin/password', label: '비밀번호', icon: KeyRound },
];

export default function AdminShell({
  admin,
  children,
}: {
  admin: Admin;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const logout = useAdminLogout();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          Portfolio <span>관리자</span>
        </Link>
        <nav aria-label="관리자 메뉴" className="admin-nav">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className="admin-nav-link"
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-account">
          <p title={admin.email}>{admin.email}</p>
          <button
            data-admin-leave
            className="admin-button-secondary"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut size={16} aria-hidden="true" />
            {logout.isPending ? '로그아웃 중…' : '로그아웃'}
          </button>
          {logout.isError && (
            <p className="admin-error" role="alert">
              {apiError(logout.error)}
            </p>
          )}
          <Link href="/" className="admin-muted">
            포트폴리오 보기 ↗
          </Link>
        </div>
      </aside>
      <main className="admin-main" id="admin-content">
        {children}
      </main>
    </div>
  );
}
