import React from 'react';
import { notFound } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getProjectById, syncFromNetlifyBlobs } from '@/lib/db';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminProjectEditor } from '@/components/admin/AdminProjectEditor';

export const dynamic = 'force-dynamic';

export default async function EditObraAdminPage(context: {
  params: Promise<{ id: string }>;
}) {
  await syncFromNetlifyBlobs();
  const { id } = await context.params;
  const authenticated = await isAuthenticatedAdmin();

  if (!authenticated) {
    return (
      <AdminShell authenticated={false}>
        <div />
      </AdminShell>
    );
  }

  const project = getProjectById(id);
  if (!project) {
    notFound();
  }

  return (
    <AdminShell authenticated={true}>
      <AdminProjectEditor isEditing={true} initialProject={project} />
    </AdminShell>
  );
}

