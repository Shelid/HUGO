'use client';

import React, { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadedImageResult {
  url: string;
  thumbnailUrl: string;
  originalName: string;
}

interface ImageUploaderProps {
  onImagesUploaded: (images: UploadedImageResult[]) => void;
  label?: string;
  multiple?: boolean;
}

export function ImageUploader({
  onImagesUploaded,
  label = 'Arrastra las imágenes aquí',
  multiple = true,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCount, setLastCount] = useState<number>(0);

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    setLastCount(0);

    try {
      const formData = new FormData();
      formData.append('scope', 'obras');
      const list = multiple ? Array.from(files) : [files[0]];
      list.forEach((file) => formData.append('files', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al subir las imágenes.');
      } else if (Array.isArray(data.uploaded)) {
        setLastCount(data.uploaded.length);
        onImagesUploaded(data.uploaded);
      }
    } catch {
      setError('Error de conexión durante la subida.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-copper bg-copper/10'
            : 'border-obsidian/25 bg-white hover:border-obsidian/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple={multiple}
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="w-7 h-7 text-copper animate-spin" />
          ) : (
            <Upload className="w-7 h-7 text-obsidian/65" />
          )}
          <p className="font-display text-base font-semibold text-obsidian">
            {uploading ? 'Optimizando y comprimiendo a WebP...' : label}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-obsidian/50">
            JPG · JPEG · PNG · WEBP — Compresión y thumbnails automáticos
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {lastCount > 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {lastCount} {lastCount === 1 ? 'imagen optimizada y añadida' : 'imágenes optimizadas y añadidas'} correctamente.
          </span>
        </div>
      )}
    </div>
  );
}

