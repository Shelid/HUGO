import React from 'react';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getCompanySettings } from '@/lib/db';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminProjectEditor } from '@/components/admin/AdminProjectEditor';

export const dynamic = 'force-dynamic';

export default async function NuevaObraAdminPage() {
  const authenticated = await isAuthenticatedAdmin();
  const settings = getCompanySettings();

  return (
    <AdminShell authenticated={authenticated}>
      <AdminProjectEditor
        isEditing={false}
        initialProject={{
          province: 'Asturias',
          status: 'published',
          warrantyWorkmanship: settings.defaultWarrantyWorkmanship,
          warrantyMaterials: settings.defaultWarrantyMaterials,
          warrantyConditions: settings.defaultWarrantyConditions,
        }}
      />
    </AdminShell>
  );
}

