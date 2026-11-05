'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

const WORK_TYPES = [
  'Cubierta',
  'Tejado',
  'Terraza',
  'Impermeabilización',
  'Reparación',
  'Rehabilitación',
  'Otro',
];

interface ContactFormProps {
  defaultWorkType?: string;
  compact?: boolean;
}

export function ContactForm({ defaultWorkType = 'Cubierta', compact = false }: ContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [workType, setWorkType] = useState(defaultWorkType);
  const [description, setDescription] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setUploadingPhotos(true);

    try {
      const formData = new FormData();
      formData.append('scope', 'lead');
      Array.from(files)
        .slice(0, 5)
        .forEach((f) => formData.append('files', f));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'No se pudieron subir las fotos.');
      } else if (Array.isArray(data.uploaded)) {
        const urls = data.uploaded.map((u: { url: string }) => u.url);
        setUploadedPhotos((prev) => [...prev, ...urls].slice(0, 6));
      }
    } catch {
      setErrorMessage('Error al subir las imágenes. Inténtelo de nuevo.');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (urlToRemove: string) => {
    setUploadedPhotos((prev) => prev.filter((u) => u !== urlToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!privacyAccepted) {
      setErrorMessage('Por favor, acepte la política de privacidad para continuar.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          municipality,
          workType,
          description,
          photos: uploadedPhotos,
          website_url: honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Error al enviar el formulario.');
      } else {
        setSubmittedSuccess(true);
      }
    } catch {
      setErrorMessage('Error de conexión. Por favor, inténtelo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="bg-[#F6F5F1] border border-obsidian/20 p-8 sm:p-12 text-center space-y-5">
        <div className="w-14 h-14 mx-auto bg-obsidian text-alabaster flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-copper" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper block">
          Solicitud Registrada · RADECO Asturias
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-obsidian">
          Hemos recibido su solicitud de presupuesto
        </h3>
        <p className="text-sm text-obsidian/70 max-w-md mx-auto leading-relaxed">
          Nuestro equipo técnico estudiará su caso en{' '}
          <strong className="text-obsidian">{municipality}</strong> y se pondrá en
          contacto con usted a la mayor brevedad para valorar la intervención.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setSubmittedSuccess(false);
              setName('');
              setPhone('');
              setEmail('');
              setMunicipality('');
              setDescription('');
              setUploadedPhotos([]);
            }}
            className="px-6 py-3 border border-obsidian/20 font-mono text-xs uppercase tracking-[0.18em] text-obsidian hover:bg-obsidian/5 transition-colors"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-[#F6F5F1] border border-obsidian/15 ${
        compact ? 'p-6 sm:p-8' : 'p-8 sm:p-12'
      } space-y-6`}
      noValidate
    >
      {/* Honeypot anti-spam field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">No rellenar este campo</label>
        <input
          id="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/5 border border-red-700/30 flex items-start gap-3 text-red-900 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label
            htmlFor="field-name"
            className="block font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/75 mb-2"
          >
            Nombre completo *
          </label>
          <input
            id="field-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Carlos Fernández"
            className="w-full px-4 py-3.5 bg-white border border-obsidian/15 text-obsidian text-sm placeholder:text-obsidian/35 focus:outline-none focus:border-obsidian transition-colors"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="field-phone"
            className="block font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/75 mb-2"
          >
            Teléfono *
          </label>
          <input
            id="field-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej. 600 000 000"
            className="w-full px-4 py-3.5 bg-white border border-obsidian/15 text-obsidian text-sm placeholder:text-obsidian/35 focus:outline-none focus:border-obsidian transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label
            htmlFor="field-email"
            className="block font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/75 mb-2"
          >
            Email
          </label>
          <input
            id="field-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="su.correo@ejemplo.es"
            className="w-full px-4 py-3.5 bg-white border border-obsidian/15 text-obsidian text-sm placeholder:text-obsidian/35 focus:outline-none focus:border-obsidian transition-colors"
          />
        </div>

        {/* Municipio */}
        <div>
          <label
            htmlFor="field-municipality"
            className="block font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/75 mb-2"
          >
            Municipio (Asturias) *
          </label>
          <input
            id="field-municipality"
            type="text"
            required
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            placeholder="Ej. Oviedo, Gijón, Mieres, Lena..."
            className="w-full px-4 py-3.5 bg-white border border-obsidian/15 text-obsidian text-sm placeholder:text-obsidian/35 focus:outline-none focus:border-obsidian transition-colors"
          />
        </div>
      </div>

      {/* Tipo de trabajo */}
      <div>
        <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/75 mb-2.5">
          Tipo de trabajo *
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WORK_TYPES.map((type) => {
            const active = workType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setWorkType(type)}
                className={`px-3 py-2.5 text-xs font-mono uppercase tracking-wider border text-center transition-all ${
                  active
                    ? 'bg-obsidian text-alabaster border-obsidian font-semibold'
                    : 'bg-white text-obsidian/75 border-obsidian/15 hover:border-obsidian/40'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="field-description"
          className="block font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/75 mb-2"
        >
          Descripción del proyecto o problema *
        </label>
        <textarea
          id="field-description"
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explíquenos brevemente qué necesita (filtraciones, rehabilitación de tejado, impermeabilización de terraza, estado actual...)"
          className="w-full px-4 py-3.5 bg-white border border-obsidian/15 text-obsidian text-sm placeholder:text-obsidian/35 focus:outline-none focus:border-obsidian transition-colors"
        />
      </div>

      {/* Fotos del problema [Upload] */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/75">
            Fotos del problema o cubierta (Opcional)
          </span>
          <span className="font-mono text-[10px] text-obsidian/45">
            JPG, PNG, WEBP · Máx. 6 fotos
          </span>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handlePhotoUpload(e.dataTransfer.files);
          }}
          className="border border-dashed border-obsidian/25 bg-white/70 hover:bg-white p-5 text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={(e) => handlePhotoUpload(e.target.files)}
          />
          <div className="flex flex-col items-center gap-1.5">
            {uploadingPhotos ? (
              <Loader2 className="w-5 h-5 text-copper animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-obsidian/60" />
            )}
            <span className="text-xs font-medium text-obsidian">
              {uploadingPhotos
                ? 'Optimizando y subiendo imágenes...'
                : 'Arrastra las imágenes aquí o haz clic para adjuntar fotos'}
            </span>
            <span className="text-[11px] text-obsidian/50">
              Nos ayuda a realizar una primera valoración técnica más precisa
            </span>
          </div>
        </div>

        {uploadedPhotos.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {uploadedPhotos.map((url) => (
              <div
                key={url}
                className="relative w-20 h-20 border border-obsidian/20 bg-obsidian overflow-hidden group"
              >
                <img src={url} alt="Foto adjunta" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-1 right-1 w-5 h-5 bg-obsidian/85 text-white flex items-center justify-center"
                  aria-label="Eliminar foto"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Acceptance */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id="privacy-check"
          type="checkbox"
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 accent-obsidian cursor-pointer"
        />
        <label htmlFor="privacy-check" className="text-xs text-obsidian/65 leading-relaxed">
          He leído y acepto la{' '}
          <Link href="/privacidad" className="underline text-obsidian hover:text-copper">
            Política de Privacidad
          </Link>{' '}
          para el tratamiento de mis datos con el único fin de elaborar el presupuesto
          solicitado.
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="submit"
          disabled={submitting || uploadingPhotos}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-[0.2em] hover:bg-charcoal disabled:opacity-50 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando solicitud...</span>
            </>
          ) : (
            <>
              <span>Solicitar presupuesto</span>
              <ArrowUpRight className="w-4 h-4" />
            </>
          )}
        </button>

        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-obsidian/55">
          <ShieldCheck className="w-4 h-4 text-copper shrink-0" />
          Estudio técnico sin compromiso
        </span>
      </div>
    </form>
  );
}

