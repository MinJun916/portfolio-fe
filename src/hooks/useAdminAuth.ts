'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import { getToken, loginDestination, setToken, subscribeSession } from '@/lib/admin-session';
import { authService } from '@/services/admin';

export function useAdminAuth() {
  const token = useSyncExternalStore(subscribeSession, getToken, () => null);
  return { token };
}

export function useAdminLogin(next: string | null) {
  const router = useRouter();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (result) => {
      setToken(result.accessToken);
      router.replace(loginDestination(next));
    },
  });
}

export function useAdminLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const token = getToken();
      try {
        await authService.logout();
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
      }
      return token;
    },
    onSuccess: (token) => {
      if (getToken() !== token) return;
      setToken(null);
      router.replace('/admin/login');
    },
  });
}

export function useAdminPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (body: Parameters<typeof authService.password>[0]) => {
      const token = getToken();
      await authService.password(body);
      return token;
    },
    onSuccess: (token) => {
      if (getToken() !== token) return;
      setToken(null);
      router.replace('/admin/login');
    },
  });
}
