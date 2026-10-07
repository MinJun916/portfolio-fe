import { notFound } from 'next/navigation';

import ContentEditor from '@/components/admin/ContentEditor';
import { isResource } from '@/constants/admin';

export default async function Page({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;
  if (
    !isResource(resource) ||
    (id !== 'new' && !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id))
  )
    notFound();
  return <ContentEditor resource={resource} id={id} />;
}
