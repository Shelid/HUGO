import React from 'react';
import { isAuthenticatedAdmin } from '@/lib/auth';
import {
  getAllProjectsAdmin,
  getCompanySettings,
  getLeadsAdmin,
  syncFromNetlifyBlobs,
} from '@/lib/db';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await syncFromNetlifyBlobs();
  const authenticated = await isAuthenticatedAdmin();
  const projects = authenticated ? getAllProjectsAdmin() : [];
  const leads = authenticated ? getLeadsAdmin() : [];
  const settings = getCompanySettings();

  return (
    <AdminShell authenticated={authenticated}>
      <AdminDashboardClient
        projects={projects}
        leads={leads}
        initialSettings={settings}
      />
    </AdminShell>
  );
}

