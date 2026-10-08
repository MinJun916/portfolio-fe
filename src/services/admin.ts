import { api, unwrap } from '@/lib/api';

import type {
  Admin,
  ApiResponse,
  ContentMap,
  InputMap,
  LoginResult,
  Resource,
  Site,
  SiteData,
} from '@/types/admin';

export const authService = {
  login: async (body: { email: string; password: string }) =>
    unwrap((await api.post<ApiResponse<LoginResult>>('/admin/auth/login', body)).data),
  me: async () => unwrap((await api.get<ApiResponse<Admin>>('/admin/auth/me')).data),
  logout: async () =>
    unwrap((await api.post<ApiResponse<{ message: string }>>('/admin/auth/logout')).data),
  password: async (body: { currentPassword: string; newPassword: string }) =>
    unwrap((await api.patch<ApiResponse<{ message: string }>>('/admin/auth/password', body)).data),
};

export const contentService = {
  site: async () => unwrap((await api.get<ApiResponse<Site>>('/admin/site')).data),
  saveSite: async (body: { version: number; data: SiteData }) =>
    unwrap((await api.patch<ApiResponse<Site>>('/admin/site', body)).data),
  list: async <R extends Resource>(resource: R) =>
    unwrap((await api.get<ApiResponse<ContentMap[R][]>>(`/admin/${resource}`)).data),
  detail: async <R extends Resource>(resource: R, id: string) =>
    unwrap((await api.get<ApiResponse<ContentMap[R]>>(`/admin/${resource}/${id}`)).data),
  create: async <R extends Resource>(resource: R, body: InputMap[R]) =>
    unwrap((await api.post<ApiResponse<ContentMap[R]>>(`/admin/${resource}`, body)).data),
  update: async <R extends Resource>(
    resource: R,
    id: string,
    body: Partial<Omit<InputMap[R], 'slug'>> & { version: number },
  ) => unwrap((await api.patch<ApiResponse<ContentMap[R]>>(`/admin/${resource}/${id}`, body)).data),
  remove: async (resource: Resource, id: string, version: number) =>
    unwrap(
      (
        await api.delete<ApiResponse<{ id: string }>>(`/admin/${resource}/${id}`, {
          params: { version },
        })
      ).data,
    ),
  reorder: async <R extends Resource>(resource: R, items: { id: string; version: number }[]) =>
    unwrap(
      (await api.patch<ApiResponse<ContentMap[R][]>>(`/admin/${resource}/order`, { items })).data,
    ),
};
