import { Suspense } from 'react';

import LoginForm from '@/components/admin/LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-status" role="status">
          로그인 화면을 준비하고 있습니다.
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
