'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { contentService } from '@/services/admin';

import type { InputMap, Resource } from '@/types/admin';

export function useContentList<R extends Resource>(resource: R) {
  return useQuery({
    queryKey: QUERY_KEYS.list(resource),
    queryFn: () => contentService.list(resource),
  });
}

export function useContentDetail<R extends Resource>(resource: R, id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(resource, id),
    queryFn: () => contentService.detail(resource, id),
    enabled: id !== 'new',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useSite() {
  return useQuery({
    queryKey: QUERY_KEYS.site,
    queryFn: contentService.site,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useSaveSite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: contentService.saveSite,
    onSuccess: (site) => {
      client.setQueryData(QUERY_KEYS.site, site);
    },
  });
}

export function useSaveContent<R extends Resource>(resource: R, id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, version }: { input: InputMap[R]; version?: number }) => {
      if (id === 'new') return contentService.create(resource, input);
      const { slug: _slug, ...fields } = input as InputMap[R] & { slug?: string };
      void _slug;
      return contentService.update(resource, id, { ...fields, version: version! });
    },
    onSuccess: async (record) => {
      client.setQueryData(QUERY_KEYS.detail(resource, record.id), record);
      await client.invalidateQueries({ queryKey: QUERY_KEYS.list(resource), exact: true });
    },
  });
}

export function useContentActions(resource: Resource) {
  const client = useQueryClient();
  const invalidate = () => client.invalidateQueries({ queryKey: QUERY_KEYS.list(resource) });
  const remove = useMutation({
    mutationFn: ({ id, version }: { id: string; version: number }) =>
      contentService.remove(resource, id, version),
    onSuccess: invalidate,
  });
  const reorder = useMutation({
    mutationFn: (items: { id: string; version: number }[]) =>
      contentService.reorder(resource, items),
    onSuccess: invalidate,
  });
  const publish = useMutation({
    mutationFn: ({
      id,
      version,
      isPublished,
    }: {
      id: string;
      version: number;
      isPublished: boolean;
    }) => contentService.update(resource, id, { version, isPublished }),
    onSuccess: invalidate,
  });
  return { remove, reorder, publish };
}
