import axios from 'axios';

import { getToken, setToken } from '@/lib/admin-session';

import type { ApiFailure, ApiResponse } from '@/types/admin';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.url !== '/admin/auth/login') {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url !== '/admin/auth/login' &&
      getToken() &&
      error.config?.headers.get('Authorization') === `Bearer ${getToken()}`
    ) {
      setToken(null);
    }
    return Promise.reject(error);
  },
);

export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

export function apiError(error: unknown) {
  if (axios.isAxiosError<ApiFailure>(error)) {
    if (error.response?.status === 409)
      return '다른 곳에서 콘텐츠가 변경되었거나 슬러그가 중복되었습니다. 입력 내용은 유지됩니다. 최신 내용을 확인해주세요.';
    if (error.response?.status === 429)
      return '로그인 시도가 너무 많습니다. 1분 후 다시 시도해주세요.';
    if (error.response?.data?.error) {
      const { message, details } = error.response.data.error;
      return [
        message,
        ...(details?.map((detail) => `${detail.path}: ${detail.message}`) ?? []),
      ].join('\n');
    }
    return '서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.';
  }
  return error instanceof Error ? error.message : '요청을 처리하지 못했습니다.';
}
