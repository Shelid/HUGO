import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getStore } from '@netlify/blobs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  const { key } = await context.params;
  if (!key || key.length === 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Sanitize path segments to prevent directory traversal
  const safeSegments = key.map((seg) => seg.replace(/[^a-zA-Z0-9._-]/g, ''));
  const blobKey = safeSegments.join('/');

  // 1. Check local public/uploads first (local dev)
  const publicPath = path.join(process.cwd(), 'public', 'uploads', ...safeSegments);
  if (fs.existsSync(publicPath)) {
    const fileBuf = fs.readFileSync(publicPath);
    return new NextResponse(fileBuf, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // 2. Check /tmp/radeco-uploads (serverless warm cache)
  const tmpPath = path.join(os.tmpdir(), 'radeco-uploads', ...safeSegments);
  if (fs.existsSync(tmpPath)) {
    const fileBuf = fs.readFileSync(tmpPath);
    return new NextResponse(fileBuf, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // 3. Check Netlify Blobs store in production
  try {
    const store = getStore('radeco-media');
    const arrayBuffer = await store.get(blobKey, { type: 'arrayBuffer' });
    if (arrayBuffer) {
      return new NextResponse(Buffer.from(arrayBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Netlify-CDN-Cache-Control': 'public, max-age=31536000, durable, immutable',
        },
      });
    }
  } catch {
    // Netlify Blobs context not active locally
  }

  return new NextResponse('Image Not Found', { status: 404 });
}

