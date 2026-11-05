'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  Eye,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { Project, ProjectGalleryImage, ProjectTechnicalSpec } from '@/types';
import { ImageUploader } from './ImageUploader';

interface AdminProjectEditorProps {
  initialProject?: Partial<Project>;
  isEditing?: boolean;
}

const AVAILABLE_SERVICES = [
  'Cubiertas y tejados',
  'Rehabilitación',
  'Impermeabilización',
  'Terrazas',
  'Reparación',
  'Mantenimiento',
  'Acabado',
];

const DEFAULT_QUALITY_ITEMS = [
  'Trabajo supervisado',
  'Materiales seleccionados',
  'Acabado profesional',
  'Control de calidad',
];

export function AdminProjectEditor({
  initialProject,
  isEditing = false,
}: AdminProjectEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialProject?.title || '');
  const [subtitle, setSubtitle] = useState(initialProject?.subtitle || '');
  const [slug, setSlug] = useState(initialProject?.slug || '');
  const [municipality, setMunicipality] = useState(initialProject?.municipality || '');
  const [province, setProvince] = useState(initialProject?.province || 'Asturias');
  const [status, setStatus] = useState<'published' | 'draft'>(
    initialProject?.status || 'published'
  );
  const [featured, setFeatured] = useState<boolean>(initialProject?.featured ?? true);

  const [coverImage, setCoverImage] = useState(
    initialProject?.coverImage || '/images/projects/oviedo-after.jpg'
  );
  const [beforeImage, setBeforeImage] = useState(initialProject?.beforeImage || '');
  const [afterImage, setAfterImage] = useState(initialProject?.afterImage || '');
  const [beforeLabel, setBeforeLabel] = useState(
    initialProject?.beforeLabel || 'Estado previo antes de la intervención'
  );
  const [afterLabel, setAfterLabel] = useState(
    initialProject?.afterLabel || 'Resultado final ejecutado por RADECO'
  );

  const [gallery, setGallery] = useState<ProjectGalleryImage[]>(
    initialProject?.gallery || []
  );

  const [description, setDescription] = useState(initialProject?.description || '');
  const [technicalContext, setTechnicalContext] = useState(
    initialProject?.technicalContext || ''
  );
  const [interventionDetails, setInterventionDetails] = useState(
    initialProject?.interventionDetails || ''
  );

  const [services, setServices] = useState<string[]>(
    initialProject?.services || ['Rehabilitación', 'Impermeabilización']
  );
  const [duration, setDuration] = useState(initialProject?.duration || '2 semanas');
  const [propertyType, setPropertyType] = useState(
    initialProject?.propertyType || 'Vivienda Residencial'
  );

  const [technicalSpecs, setTechnicalSpecs] = useState<ProjectTechnicalSpec[]>(
    initialProject?.technicalSpecs && initialProject.technicalSpecs.length > 0
      ? initialProject.technicalSpecs
      : [
          { label: 'Sistema constructivo', value: 'Cubierta rehabilitada e impermeabilizada' },
          { label: 'Materiales', value: 'Sistemas seleccionados de alta durabilidad' },
        ]
  );

  const [warrantyWorkmanship, setWarrantyWorkmanship] = useState(
    initialProject?.warrantyWorkmanship || '5 años'
  );
  const [warrantyMaterials, setWarrantyMaterials] = useState(
    initialProject?.warrantyMaterials || 'Según fabricante'
  );
  const [warrantyConditions, setWarrantyConditions] = useState(
    initialProject?.warrantyConditions ||
      'Garantía de mano de obra aplicable a los trabajos ejecutados según alcance de obra. Garantía de materiales conforme a las pólizas de cada fabricante.'
  );

  const [qualitySealItems, setQualitySealItems] = useState<string[]>(
    initialProject?.qualitySealItems && initialProject.qualitySealItems.length > 0
      ? initialProject.qualitySealItems
      : DEFAULT_QUALITY_ITEMS
  );
  const [newSealItem, setNewSealItem] = useState('');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  const toggleService = (srv: string) => {
    setServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleGalleryUpload = (
    uploaded: { url: string; thumbnailUrl: string; originalName: string }[]
  ) => {
    setGallery((prev) => {
      const startOrder = prev.length + 1;
      const added: ProjectGalleryImage[] = uploaded.map((item, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        alt: `${title || 'Obra RADECO'} — ${municipality || 'Asturias'} (${idx + 1})`,
        caption: '',
        category: 'acabado',
        order: startOrder + idx,
      }));
      const combined = [...prev, ...added];
      if (!coverImage && combined.length > 0) {
        setCoverImage(combined[0].url);
      }
      return combined;
    });
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    setGallery((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const removeGalleryItem = (id: string) => {
    setGallery((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, idx) => ({ ...item, order: idx + 1 }))
    );
  };

  const updateGalleryCaption = (id: string, caption: string) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption } : item))
    );
  };

  const updateGalleryCategory = (
    id: string,
    category: ProjectGalleryImage['category']
  ) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category } : item))
    );
  };

  const addSpecRow = () => {
    setTechnicalSpecs((prev) => [...prev, { label: '', value: '' }]);
  };

  const updateSpecRow = (idx: number, field: 'label' | 'value', val: string) => {
    setTechnicalSpecs((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    );
  };

  const removeSpecRow = (idx: number) => {
    setTechnicalSpecs((prev) => prev.filter((_, i) => i !== idx));
  };

  const addQualitySealItem = () => {
    const clean = newSealItem.trim();
    if (!clean) return;
    if (!qualitySealItems.includes(clean)) {
      setQualitySealItems((prev) => [...prev, clean]);
    }
    setNewSealItem('');
  };

  const removeQualitySealItem = (item: string) => {
    setQualitySealItems((prev) => prev.filter((i) => i !== item));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!title.trim() || !municipality.trim()) {
      setFeedback({
        type: 'err',
        text: 'El título de la obra y el municipio son obligatorios.',
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        subtitle,
        slug: slug.trim() || undefined,
        municipality,
        province,
        status,
        featured,
        coverImage,
        beforeImage: beforeImage || undefined,
        afterImage: afterImage || undefined,
        beforeLabel,
        afterLabel,
        gallery,
        description,
        technicalContext,
        interventionDetails,
        services,
        duration,
        propertyType,
        technicalSpecs,
        warrantyWorkmanship,
        warrantyMaterials,
        warrantyConditions,
        qualitySealItems,
      };

      const endpoint =
        isEditing && initialProject?.id
          ? `/api/projects/${initialProject.id}`
          : '/api/projects';
      const method = isEditing && initialProject?.id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          type: 'err',
          text: data.error || 'No se pudo guardar la obra.',
        });
      } else {
        setFeedback({
          type: 'ok',
          text: 'Obra guardada correctamente en el catálogo RADECO.',
        });
        if (!isEditing && data.project?.id) {
          router.push(`/admin/obras/${data.project.id}`);
        } else {
          router.refresh();
        }
      }
    } catch {
      setFeedback({ type: 'err', text: 'Error de red al guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !initialProject?.id) return;
    const confirmed = window.confirm(
      `¿Está seguro de eliminar permanentemente la obra "${title}"?`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${initialProject.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/obras');
        router.refresh();
      } else {
        setFeedback({ type: 'err', text: 'No se pudo eliminar la obra.' });
      }
    } catch {
      setFeedback({ type: 'err', text: 'Error al eliminar la obra.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-10 pb-20">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-0 z-30 bg-[#F6F5F1]/95 backdrop-blur-md border-b border-obsidian/15 py-4 px-6 -mx-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/obras"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-obsidian/70 hover:text-obsidian"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Obras</span>
          </Link>
          <span className="text-obsidian/20">|</span>
          <h1 className="font-display text-lg sm:text-xl font-semibold text-obsidian truncate max-w-md">
            {isEditing ? `Editar: ${title}` : 'Nueva Obra RADECO'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Toggle */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className={`px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider border focus:outline-none ${
              status === 'published'
                ? 'bg-emerald-950/10 border-emerald-700/40 text-emerald-900 font-semibold'
                : 'bg-amber-950/10 border-amber-700/40 text-amber-900'
            }`}
          >
            <option value="published">Estado: Publicado</option>
            <option value="draft">Estado: Borrador</option>
          </select>

          {initialProject?.slug && (
            <Link
              href={`/obras/${initialProject.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-obsidian/20 text-xs font-mono uppercase tracking-wider text-obsidian hover:bg-obsidian/5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver página</span>
            </Link>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-red-700/30 text-red-800 hover:bg-red-50 text-xs font-mono uppercase tracking-wider"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.18em] hover:bg-charcoal disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Guardar Obra</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 border text-sm font-medium ${
            feedback.type === 'ok'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* 1. IDENTIFICACIÓN Y LOCALIZACIÓN */}
      <div className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6">
        <div className="border-b border-obsidian/10 pb-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
              01 · Identificación del Proyecto
            </span>
            <h2 className="font-display text-xl font-semibold text-obsidian">
              Título, Subtítulo y Municipio
            </h2>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-obsidian"
            />
            <span>Destacar en portada</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Título de la obra *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Rehabilitación integral de cubierta"
              className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Slug / Identificador URL (Opcional, se genera automático)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="rehabilitacion-cubierta-oviedo"
              className="w-full px-4 py-3 border border-obsidian/20 text-sm font-mono focus:outline-none focus:border-obsidian"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
            Subtítulo descriptivo *
          </label>
          <input
            type="text"
            required
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ej. Rehabilitación y mejora de la impermeabilización de una cubierta residencial."
            className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Ciudad / Municipio * (NUNCA calle exacta)
            </label>
            <input
              type="text"
              required
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              placeholder="Ej. Oviedo, Mieres, Gijón, Lena..."
              className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Provincia / Comunidad
            </label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Duración de la obra
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ej. 3 semanas"
              className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
            />
          </div>
        </div>
      </div>

      {/* 2. SERVICIOS REALIZADOS Y DESCRIPCIÓN TÉCNICA */}
      <div className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6">
        <div className="border-b border-obsidian/10 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
            02 · Memoria Técnica
          </span>
          <h2 className="font-display text-xl font-semibold text-obsidian">
            Servicios Realizados y Descripción de la Obra
          </h2>
        </div>

        <div>
          <span className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2.5">
            Servicios realizados en esta obra
          </span>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SERVICES.map((srv) => {
              const active = services.includes(srv);
              return (
                <button
                  key={srv}
                  type="button"
                  onClick={() => toggleService(srv)}
                  className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-all inline-flex items-center gap-1.5 ${
                    active
                      ? 'bg-obsidian text-alabaster border-obsidian'
                      : 'bg-alabaster/50 text-obsidian/70 border-obsidian/15 hover:border-obsidian/40'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 text-copper" />}
                  <span>{srv}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
            Descripción principal de la obra *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describa en detalle el trabajo realizado en esta cubierta o terraza..."
            className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Diagnóstico / Estado previo (Opcional)
            </label>
            <textarea
              rows={3}
              value={technicalContext}
              onChange={(e) => setTechnicalContext(e.target.value)}
              placeholder="Patologías iniciales detectadas durante la inspección..."
              className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Solución constructiva ejecutada (Opcional)
            </label>
            <textarea
              rows={3}
              value={interventionDetails}
              onChange={(e) => setInterventionDetails(e.target.value)}
              placeholder="Detalles de ejecución, rematería y acabados..."
              className="w-full px-4 py-3 border border-obsidian/20 text-sm focus:outline-none focus:border-obsidian"
            />
          </div>
        </div>

        {/* Technical Specs Table */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-obsidian/70">
              Ficha de Detalles Técnicos
            </span>
            <button
              type="button"
              onClick={addSpecRow}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-copper hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir especificación</span>
            </button>
          </div>
          <div className="space-y-2.5">
            {technicalSpecs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => updateSpecRow(idx, 'label', e.target.value)}
                  placeholder="Ej. Impermeabilización"
                  className="w-1/3 px-3 py-2 border border-obsidian/20 text-xs"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                  placeholder="Ej. Lámina transpirable multicapa"
                  className="flex-1 px-3 py-2 border border-obsidian/20 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  className="p-2 text-obsidian/45 hover:text-red-700"
                  aria-label="Eliminar fila"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GALERÍA EXCLUSIVA DE LA OBRA & FOTO PRINCIPAL */}
      <div className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6">
        <div className="border-b border-obsidian/10 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
            03 · Galería Individual de la Obra
          </span>
          <h2 className="font-display text-xl font-semibold text-obsidian">
            Subida de Fotos, Organización y Foto Principal
          </h2>
          <p className="text-xs text-obsidian/60 mt-1">
            Las fotografías subidas aquí pertenecen exclusivamente a esta obra.
          </p>
        </div>

        <ImageUploader
          label="Arrastra las imágenes aquí para añadirlas a la galería de esta obra"
          onImagesUploaded={handleGalleryUpload}
        />

        {/* Cover Image URL input / indicator */}
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
            Foto principal de portada (Seleccione abajo o indique URL)
          </label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-2.5 border border-obsidian/20 text-xs font-mono"
          />
        </div>

        {/* Gallery Organizer Grid */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {gallery.map((img, idx) => {
              const isCover = coverImage === img.url;
              return (
                <div
                  key={img.id}
                  className={`p-4 border flex gap-4 items-start ${
                    isCover
                      ? 'border-copper bg-copper/5'
                      : 'border-obsidian/15 bg-alabaster/30'
                  }`}
                >
                  <img
                    src={img.thumbnailUrl || img.url}
                    alt={img.alt}
                    className="w-28 h-24 object-cover bg-obsidian shrink-0 border border-obsidian/15"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-obsidian/60">
                        Foto #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveGalleryItem(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 border border-obsidian/15 disabled:opacity-30 hover:bg-white"
                          title="Subir orden"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryItem(idx, 1)}
                          disabled={idx === gallery.length - 1}
                          className="p-1 border border-obsidian/15 disabled:opacity-30 hover:bg-white"
                          title="Bajar orden"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(img.id)}
                          className="p-1 border border-red-200 text-red-700 hover:bg-red-50"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => updateGalleryCaption(img.id, e.target.value)}
                      placeholder="Pie de foto o descripción técnica..."
                      className="w-full px-2.5 py-1.5 bg-white border border-obsidian/15 text-xs"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <select
                        value={img.category || 'acabado'}
                        onChange={(e) =>
                          updateGalleryCategory(
                            img.id,
                            e.target.value as ProjectGalleryImage['category']
                          )
                        }
                        className="px-2 py-1 bg-white border border-obsidian/15 text-[11px] font-mono"
                      >
                        <option value="acabado">Acabado</option>
                        <option value="ejecucion">Ejecución</option>
                        <option value="detalle">Detalle técnico</option>
                        <option value="estructura">Estructura</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setCoverImage(img.url)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${
                          isCover
                            ? 'bg-copper text-white font-semibold'
                            : 'border border-obsidian/20 text-obsidian hover:bg-white'
                        }`}
                      >
                        <Star className="w-3 h-3" />
                        <span>{isCover ? 'Foto Principal' : 'Usar como Principal'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. COMPARADOR ANTES / DESPUÉS */}
      <div className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6">
        <div className="border-b border-obsidian/10 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
            04 · Transformación Visual
          </span>
          <h2 className="font-display text-xl font-semibold text-obsidian">
            Comparativa Interactiva Antes / Después
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ANTES */}
          <div className="space-y-3 p-4 bg-alabaster/40 border border-obsidian/10">
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-obsidian block">
              Imagen ANTES de la obra
            </span>
            <ImageUploader
              multiple={false}
              label="Subir foto del estado ANTES"
              onImagesUploaded={(imgs) => {
                if (imgs[0]) setBeforeImage(imgs[0].url);
              }}
            />
            <input
              type="text"
              value={beforeImage}
              onChange={(e) => setBeforeImage(e.target.value)}
              placeholder="URL de la foto Antes..."
              className="w-full px-3 py-2 bg-white border border-obsidian/15 text-xs font-mono"
            />
            <input
              type="text"
              value={beforeLabel}
              onChange={(e) => setBeforeLabel(e.target.value)}
              placeholder="Etiqueta Antes..."
              className="w-full px-3 py-2 bg-white border border-obsidian/15 text-xs"
            />
          </div>

          {/* DESPUÉS */}
          <div className="space-y-3 p-4 bg-alabaster/40 border border-obsidian/10">
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-copper block">
              Imagen DESPUÉS de la obra
            </span>
            <ImageUploader
              multiple={false}
              label="Subir foto del resultado DESPUÉS"
              onImagesUploaded={(imgs) => {
                if (imgs[0]) setAfterImage(imgs[0].url);
              }}
            />
            <input
              type="text"
              value={afterImage}
              onChange={(e) => setAfterImage(e.target.value)}
              placeholder="URL de la foto Después..."
              className="w-full px-3 py-2 bg-white border border-obsidian/15 text-xs font-mono"
            />
            <input
              type="text"
              value={afterLabel}
              onChange={(e) => setAfterLabel(e.target.value)}
              placeholder="Etiqueta Después..."
              className="w-full px-3 py-2 bg-white border border-obsidian/15 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 5. GARANTÍAS Y SELLO DE CALIDAD RADECO */}
      <div className="bg-white border border-obsidian/15 p-6 sm:p-8 space-y-6">
        <div className="border-b border-obsidian/10 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper block">
            05 · Garantías Configurables y Certificación
          </span>
          <h2 className="font-display text-xl font-semibold text-obsidian">
            Garantía de Mano de Obra, Materiales y Sello de Calidad RADECO
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Garantía de mano de obra (Configurable)
            </label>
            <input
              type="text"
              value={warrantyWorkmanship}
              onChange={(e) => setWarrantyWorkmanship(e.target.value)}
              placeholder="Ej. 5 años"
              className="w-full px-4 py-3 border border-obsidian/20 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
              Garantía de materiales (Configurable)
            </label>
            <input
              type="text"
              value={warrantyMaterials}
              onChange={(e) => setWarrantyMaterials(e.target.value)}
              placeholder="Ej. Según fabricante"
              className="w-full px-4 py-3 border border-obsidian/20 text-sm font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
            Condiciones específicas de garantía para este proyecto
          </label>
          <textarea
            rows={3}
            value={warrantyConditions}
            onChange={(e) => setWarrantyConditions(e.target.value)}
            className="w-full px-4 py-3 border border-obsidian/20 text-sm"
          />
        </div>

        {/* Sello de Calidad Items */}
        <div className="pt-2">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-obsidian/70 mb-2">
            Puntos verificados en el Sello de Calidad RADECO
          </span>
          <div className="flex flex-wrap gap-2 mb-3">
            {qualitySealItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-obsidian text-alabaster text-xs font-mono"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-copper" />
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeQualitySealItem(item)}
                  className="text-white/60 hover:text-white ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newSealItem}
              onChange={(e) => setNewSealItem(e.target.value)}
              placeholder="Añadir punto de control (ej. Prueba de estanqueidad)"
              className="flex-1 px-3 py-2 border border-obsidian/20 text-xs"
            />
            <button
              type="button"
              onClick={addQualitySealItem}
              className="px-4 py-2 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-wider"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

