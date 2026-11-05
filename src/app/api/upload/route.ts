import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { getStore } from '@netlify/blobs';
import { checkRateLimit, isAuthenticatedAdmin } from '@/lib/auth';

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

function hasValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }
  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }
  // WEBP: RIFF....WEBP
  const riff = buffer.subarray(0, 4).toString('ascii');
  const webp = buffer.subarray(8, 12).toString('ascii');
  if (riff === 'RIFF' && webp === 'WEBP') {
    return true;
  }
  return false;
}

async function persistMediaFile(
  scope: string,
  fileName: string,
  data: Buffer
): Promise<void> {
  // 1. Try saving to Netlify Blobs (production persistence on Netlify)
  try {
    const store = getStore('radeco-media');
    const arrayBuffer = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;
    await store.set(`${scope}/${fileName}`, arrayBuffer, {
      metadata: { contentType: 'image/webp' },
    });
  } catch {
    // Netlify Blobs not active in local dev
  }

  // 2. Try saving to local public/uploads (local development)
  try {
    const publicDir = path.join(process.cwd(), 'public', 'uploads', scope);
    fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, fileName), data);
    return;
  } catch {
    // Read-only filesystem in serverless environment; fallback to os.tmpdir()
  }

  // 3. Save to /tmp/radeco-uploads warm cache
  try {
    const tmpDir = path.join(os.tmpdir(), 'radeco-uploads', scope);
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, fileName), data);
  } catch {
    // ignore
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local-ip';

  const rate = checkRateLimit(`upload:${ip}`, 30, 1000 * 60 * 10);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Límite de subidas excedido temporalmente.' },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const scope = formData.get('scope') === 'lead' ? 'leads' : 'obras';

    if (scope === 'obras') {
      const isAdmin = await isAuthenticatedAdmin();
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'No autorizado para subir imágenes al catálogo.' },
          { status: 401 }
        );
      }
    }

    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se recibieron imágenes válidas.' },
        { status: 400 }
      );
    }

    const uploadedItems: {
      url: string;
      thumbnailUrl: string;
      width?: number;
      height?: number;
      originalName: string;
    }[] = [];

    for (const file of files.slice(0, 12)) {
      if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: `Formato no permitido (${file.name}). Use JPG, JPEG, PNG o WEBP.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `El archivo ${file.name} supera el límite de 12 MB.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (!hasValidImageMagicBytes(buffer)) {
        return NextResponse.json(
          { error: `El archivo ${file.name} no es una imagen válida.` },
          { status: 400 }
        );
      }

      const baseId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const mainFileName = `radeco-${baseId}.webp`;
      const thumbFileName = `radeco-${baseId}-thumb.webp`;

      // Optimize main image in memory (max 1920px, WebP quality 84, strip EXIF GPS metadata)
      const mainResult = await sharp(buffer)
        .rotate()
        .resize({ width: 1920, height: 1440, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84 })
        .toBuffer({ resolveWithObject: true });

      // Generate responsive thumbnail in memory (max 640px, WebP quality 78)
      const thumbBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 640, height: 480, fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();

      await persistMediaFile(scope, mainFileName, mainResult.data);
      await persistMediaFile(scope, thumbFileName, thumbBuffer);

      uploadedItems.push({
        url: `/api/media/${scope}/${mainFileName}`,
        thumbnailUrl: `/api/media/${scope}/${thumbFileName}`,
        width: mainResult.info.width,
        height: mainResult.info.height,
        originalName: file.name,
      });
    }

    return NextResponse.json({ uploaded: uploadedItems });
  } catch {
    return NextResponse.json(
      { error: 'Error al procesar y optimizar las imágenes.' },
      { status: 500 }
    );
  }
}
