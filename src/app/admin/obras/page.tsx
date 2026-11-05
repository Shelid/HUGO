import React from 'react';
import Link from 'next/link';
import { Edit3, Eye, FolderPlus, MapPin, ShieldCheck } from 'lucide-react';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getAllProjectsAdmin, syncFromNetlifyBlobs } from '@/lib/db';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminObrasListPage() {
  await syncFromNetlifyBlobs();
  const authenticated = await isAuthenticatedAdmin();
  const projects = authenticated ? getAllProjectsAdmin() : [];

  return (
    <AdminShell authenticated={authenticated}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian/15">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block mb-1">
              Gestión del Catálogo
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-obsidian uppercase tracking-tight">
              Obras
            </h1>
          </div>

          <Link
            href="/admin/obras/nueva"
            className="self-start sm:self-auto inline-flex items-center gap-2.5 px-6 py-3.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-charcoal"
          >
            <FolderPlus className="w-4 h-4 text-copper" />
            <span>Nueva Obra</span>
          </Link>
        </div>

        {/* Obras List formatted cleanly per Section 15 */}
        <div className="bg-white border border-obsidian/15 divide-y divide-obsidian/15">
          {projects.map((obra) => {
            const isPub = obra.status === 'published';
            return (
              <div
                key={obra.id}
                className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-alabaster/35 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <img
                    src={obra.coverImage}
                    alt={obra.title}
                    className="w-32 h-22 object-cover bg-obsidian border border-obsidian/15 shrink-0"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold ${
                          isPub
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        Estado: {isPub ? 'Publicado' : 'Borrador'}
                      </span>
                      <span className="font-mono text-xs text-obsidian/55 inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-copper" />
                        {obra.municipality}, {obra.province}
                      </span>
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-obsidian">
                      {obra.title} — {obra.municipality}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-obsidian/60">
                      <span>Slug: /obras/{obra.slug}</span>
                      <span>·</span>
                      <span>Galería: {obra.gallery?.length || 0} fotos</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-copper" />
                        Garantía: {obra.warrantyWorkmanship}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center">
                  <Link
                    href={`/obras/${obra.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-obsidian/20 text-xs font-mono uppercase tracking-wider text-obsidian hover:bg-obsidian/5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Página</span>
                  </Link>

                  <Link
                    href={`/admin/obras/${obra.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-obsidian text-alabaster text-xs font-mono uppercase tracking-wider hover:bg-charcoal"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Obra</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}

