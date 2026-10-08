'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useAdminPassword } from '@/hooks/useAdminAuth';
import { apiError } from '@/lib/api';

import type { FormEvent } from 'react';

export default function PasswordForm() {
  const password = useAdminPassword();
  const [error, setError] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.isPending) return;
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get('newPassword'));
    if (newPassword !== data.get('confirmPassword')) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    password.mutate(
      { currentPassword: String(data.get('currentPassword')), newPassword },
      {
        onSuccess: () => toast.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.'),
      },
    );
  };
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-title">비밀번호 변경</h1>
        <p className="admin-muted">변경하면 모든 세션이 종료됩니다.</p>
      </header>
      <form
        onSubmit={submit}
        className="admin-card admin-form admin-narrow"
        aria-busy={password.isPending}
      >
        <label className="admin-field">
          현재 비밀번호
          <input
            className="admin-input"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
          />
        </label>
        <label className="admin-field">
          새 비밀번호
          <input
            className="admin-input"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
            aria-describedby="password-help"
          />
        </label>
        <p id="password-help" className="admin-muted">
          12~128자로 입력해주세요.
        </p>
        <label className="admin-field">
          새 비밀번호 확인
          <input
            className="admin-input"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </label>
        {(error || password.isError) && (
          <p className="admin-error" role="alert">
            {error || apiError(password.error)}
          </p>
        )}
        <button className="admin-button" type="submit" disabled={password.isPending}>
          {password.isPending ? '변경 중…' : '비밀번호 변경'}
        </button>
      </form>
    </div>
  );
}
