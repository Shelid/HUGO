'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Edit3,
  Eye,
  FolderPlus,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { CompanySettings, LeadSubmission, Project } from '@/types';

interface AdminDashboardClientProps {
  projects: Project[];
  leads: LeadSubmission[];
  initialSettings: CompanySettings;
}

export function AdminDashboardClient({
  projects,
  leads,
  initialSettings,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  const handleToggleProjectStatus = async (project: Project) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    router.refresh();
  };

  const handleLeadStatusChange = async (
    leadId: string,
    status: LeadSubmission['status']
  ) => {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, status }),
    });
    router.refresh();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSaved(true);
        router.refresh();
      }
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Top Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian/15">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-copper block mb-1">
            Panel de Control Interno
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-obsidian">
            Administración RADECO
          </h1>
        </div>

        <Link
          href="/admin/obras/nueva"
          className="self-start sm:self-auto inline-flex items-center gap-2.5 px-6 py-3.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-charcoal"
        >
          <FolderPlus className="w-4 h-4 text-copper" />
          <span>Crear Nueva Obra</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-obsidian/15 p-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55 block">
            Total Obras
          </span>
          <p className="font-display text-3xl font-bold text-obsidian mt-2">
            {projects.length}
          </p>
        </div>
        <div className="bg-white border border-obsidian/15 p-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-800 block">
            Obras Publicadas
          </span>
          <p className="font-display text-3xl font-bold text-emerald-900 mt-2">
            {publishedCount}
          </p>
        </div>
        <div className="bg-white border border-obsidian/15 p-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-800 block">
            En Borrador
          </span>
          <p className="font-display text-3xl font-bold text-amber-900 mt-2">
            {draftCount}
          </p>
        </div>
        <div className="bg-white border border-obsidian/15 p-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
            Solicitudes de Presupuesto
          </span>
          <p className="font-display text-3xl font-bold text-obsidian mt-2">
            {leads.length}
          </p>
        </div>
      </div>

      {/* SECTION 15: ORGANIZACIÓN DE LAS OBRAS */}
      <div className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian/12">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-copper block">
              Catálogo de Proyectos Independientes
            </span>
            <h2 className="font-display text-2xl font-bold text-obsidian uppercase tracking-wide">
              Obras
            </h2>
          </div>
          <Link
            href="/admin/obras"
            className="font-mono text-xs uppercase tracking-wider text-copper hover:underline"
          >
            Ver gestor completo de obras →
          </Link>
        </div>

        <div className="divide-y divide-obsidian/15">
          {projects.map((obra) => {
            const isPub = obra.status === 'published';
            return (
              <div
                key={obra.id}
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={obra.coverImage}
                    alt={obra.title}
                    className="w-20 h-14 object-cover bg-obsidian border border-obsidian/15 shrink-0"
                  />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-obsidian">
                      {obra.title} — {obra.municipality}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 font-mono text-xs">
                      <span className="text-obsidian/55">Estado:</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          isPub
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isPub ? 'Publicado' : 'Borrador'}
                      </span>
                      <span className="text-obsidian/30">|</span>
                      <span className="text-obsidian/55">Slug: /obras/{obra.slug}</span>
                      <span className="text-obsidian/30">|</span>
                      <span className="text-obsidian/55">
                        {obra.gallery?.length || 0} fotos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleProjectStatus(obra)}
                    className="px-3 py-2 border border-obsidian/20 text-[11px] font-mono uppercase tracking-wider hover:bg-obsidian/5"
                  >
                    {isPub ? 'Pasar a Borrador' : 'Publicar'}
                  </button>
                  <Link
                    href={`/obras/${obra.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-2 border border-obsidian/20 text-[11px] font-mono uppercase tracking-wider hover:bg-obsidian/5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </Link>
                  <Link
                    href={`/admin/obras/${obra.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-obsidian text-alabaster text-[11px] font-mono uppercase tracking-wider hover:bg-charcoal"
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

      {/* INCOMING QUOTE REQUESTS (SOLICITUDES DE PRESUPUESTO) */}
      <div className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-obsidian/12">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-copper block">
            Formularios Recibidos
          </span>
          <h2 className="font-display text-2xl font-bold text-obsidian">
            Solicitudes de Presupuesto Recientes ({leads.length})
          </h2>
        </div>

        {leads.length === 0 ? (
          <p className="text-sm text-obsidian/60 py-4">
            Aún no se han recibido solicitudes desde el formulario público.
          </p>
        ) : (
          <div className="divide-y divide-obsidian/15">
            {leads.map((lead) => (
              <div key={lead.id} className="py-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-wider mr-2">
                      {lead.workType}
                    </span>
                    <strong className="font-display text-lg text-obsidian">
                      {lead.name}
                    </strong>
                    <span className="ml-3 font-mono text-xs text-copper">
                      📍 {lead.municipality}, Asturias
                    </span>
                  </div>

                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleLeadStatusChange(
                        lead.id,
                        e.target.value as LeadSubmission['status']
                      )
                    }
                    className="px-3 py-1.5 border border-obsidian/20 text-xs font-mono uppercase"
                  >
                    <option value="nuevo">Estado: Nuevo</option>
                    <option value="en_estudio">Estado: En estudio</option>
                    <option value="presupuestado">Estado: Presupuestado</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-6 text-xs font-mono text-obsidian/70">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-copper" />
                    {lead.phone}
                  </span>
                  {lead.email && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-copper" />
                      {lead.email}
                    </span>
                  )}
                  <span className="text-obsidian/45">
                    Fecha: {new Date(lead.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>

                <p className="text-sm text-obsidian/80 bg-alabaster/60 p-3.5 border border-obsidian/10">
                  {lead.description}
                </p>

                {lead.photos && lead.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lead.photos.map((photoUrl) => (
                      <a
                        key={photoUrl}
                        href={photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 border border-obsidian/20 overflow-hidden block"
                      >
                        <img
                          src={photoUrl}
                          alt="Foto adjunta del cliente"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GLOBAL SETTINGS & WHATSAPP / WARRANTY DEFAULTS */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-obsidian/12">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-copper block">
              Parámetros Globales de la Empresa
            </span>
            <h2 className="font-display text-2xl font-bold text-obsidian">
              Contacto, WhatsApp y Valores por Defecto de Garantía
            </h2>
          </div>
          <Settings className="w-5 h-5 text-obsidian/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Teléfono Público
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-obsidian/20 text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Número de WhatsApp (Con prefijo 34)
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) =>
                setSettings({ ...settings, whatsappNumber: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-obsidian/20 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Email de Contacto
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-obsidian/20 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Horario de Atención
            </label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) =>
                setSettings({ ...settings, businessHours: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-obsidian/20 text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Garantía Mano de Obra (Por Defecto)
            </label>
            <input
              type="text"
              value={settings.defaultWarrantyWorkmanship}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultWarrantyWorkmanship: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 border border-obsidian/20 text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Garantía Materiales (Por Defecto)
            </label>
            <input
              type="text"
              value={settings.defaultWarrantyMaterials}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultWarrantyMaterials: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 border border-obsidian/20 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
            Texto General de Condiciones de Garantía
          </label>
          <textarea
            rows={3}
            value={settings.defaultWarrantyConditions}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultWarrantyConditions: e.target.value,
              })
            }
            className="w-full px-3.5 py-2.5 border border-obsidian/20 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={savingSettings}
            className="inline-flex items-center gap-2 px-6 py-3 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-charcoal"
          >
            {savingSettings ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Guardar Configuración Global</span>
          </button>

          {settingsSaved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              Configuración actualizada
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

