import { notFound } from 'next/navigation';

import ContentList from '@/components/admin/ContentList';
import { isResource } from '@/constants/admin';

export default async function Page({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResource(resource)) notFound();
  return <ContentList resource={resource} />;
}
