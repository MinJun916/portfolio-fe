import type { Resource } from '@/types/admin';

export const RESOURCE_LABELS: Record<Resource, string> = {
  projects: '프로젝트',
  experiences: '경력 · 활동',
  'tech-groups': '기술 그룹',
};

export function isResource(value: string): value is Resource {
  return Object.hasOwn(RESOURCE_LABELS, value);
}
