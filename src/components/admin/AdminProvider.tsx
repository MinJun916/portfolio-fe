'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';

import { getToken, subscribeSession } from '@/lib/admin-session';

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  useEffect(() => {
    let token = getToken();
    return subscribeSession(() => {
      const next = getToken();
      if (next === token) return;
      token = next;
      void client.cancelQueries();
      client.removeQueries();
      if (!next) client.getMutationCache().clear();
    });
  }, [client]);
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
