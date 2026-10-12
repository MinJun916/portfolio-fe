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

import { AdminSpinner } from './AdminSpinner';

import type { Admin } from '@/types/admin';

const navigation = [
  {
    label: '워크스페이스',
    items: [{ href: '/admin', label: '대시보드', icon: LayoutDashboard }],
  },
  {
    label: '콘텐츠',
    items: [
      { href: '/admin/site', label: '사이트', icon: Globe },
      { href: '/admin/projects', label: '프로젝트', icon: FolderOpen },
      { href: '/admin/experiences', label: '경험', icon: BriefcaseBusiness },
      { href: '/admin/tech-groups', label: '기술 스택', icon: Layers },
    ],
  },
  {
    label: '계정',
    items: [{ href: '/admin/password', label: '비밀번호', icon: KeyRound }],
  },
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
      <a className="admin-skip-link" href="#admin-content">
        본문으로 건너뛰기
      </a>
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand-icon">
            <Layers size={22} aria-hidden="true" />
          </span>
          <div>
            Portfolio <span>관리자 워크스페이스</span>
          </div>
        </Link>
        <nav aria-label="관리자 메뉴" className="admin-nav">
          {navigation.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <p className="admin-nav-label">{group.label}</p>
              {group.items.map(({ href, label, icon: Icon }) => {
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
            </div>
          ))}
        </nav>
        <div className="admin-account">
          <div className="admin-account-identity">
            <p className="admin-account-label">로그인 계정</p>
            <p className="admin-account-email" title={admin.email}>
              {admin.email}
            </p>
          </div>
          <button
            data-admin-leave
            className="admin-button-secondary"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            {logout.isPending ? <AdminSpinner /> : <LogOut size={16} aria-hidden="true" />}
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
      <main className="admin-main" id="admin-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
