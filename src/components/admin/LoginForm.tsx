'use client';

import { useSearchParams } from 'next/navigation';

import { useAdminLogin } from '@/hooks/useAdminAuth';
import { apiError } from '@/lib/api';

import type { FormEvent } from 'react';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const login = useAdminLogin(searchParams.get('next'));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (login.isPending) return;
    const data = new FormData(event.currentTarget);
    login.mutate({
      email: String(data.get('email')).trim(),
      password: String(data.get('password')),
    });
  };
  return (
    <main className="admin-login">
      <div className="admin-login-card admin-card">
        <p className="admin-eyebrow">PORTFOLIO ADMIN</p>
        <h1 className="admin-title">다시 만나 반갑습니다.</h1>
        <p className="admin-muted">관리자 계정으로 포트폴리오를 관리하세요.</p>
        <form onSubmit={submit} className="admin-form" aria-busy={login.isPending}>
          <label className="admin-field">
            이메일
            <input
              className="admin-input"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </label>
          <label className="admin-field">
            비밀번호
            <input
              className="admin-input"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={128}
            />
          </label>
          {login.isError && (
            <p className="admin-error" role="alert">
              {apiError(login.error)}
            </p>
          )}
          <button className="admin-button" type="submit" disabled={login.isPending}>
            {login.isPending ? '로그인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}
