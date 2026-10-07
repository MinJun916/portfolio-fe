import type { Resource } from '@/types/admin';

export const QUERY_KEYS = {
  admin: ['admin'] as const,
  session: (path: string) => ['admin', 'session', path] as const,
  site: ['admin', 'site'] as const,
  list: (resource: Resource) => ['admin', resource] as const,
  detail: (resource: Resource, id: string) => ['admin', resource, id] as const,
};
