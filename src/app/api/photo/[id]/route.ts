import { Readable } from 'stream';
import { NextRequest } from 'next/server';
import { GALLERY_ENABLED } from '@/lib/flags';
import { getDrive } from '@/lib/server';

// Proxies Drive files so the folder can stay private. ?full=1 → original, otherwise thumbnail.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!GALLERY_ENABLED) return new Response(null, { status: 404 });
  const { id } = await params;
  const conn = await getDrive();
  if (!conn || !/^[\w-]+$/.test(id)) return new Response(null, { status: 404 });

  const meta = await conn.drive.files.get({ fileId: id, fields: 'mimeType,thumbnailLink,parents' });
  if (!meta.data.parents?.includes(await conn.photosFolder())) return new Response(null, { status: 404 });
  const headers = { 'Cache-Control': 'private, max-age=86400' };

  if (req.nextUrl.searchParams.has('full') || !meta.data.thumbnailLink) {
    const file = await conn.drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' });
    return new Response(Readable.toWeb(file.data) as ReadableStream, {
      headers: { ...headers, 'Content-Type': meta.data.mimeType ?? 'application/octet-stream' },
    });
  }

  const { token } = await conn.auth.getAccessToken();
  const thumb = await fetch(meta.data.thumbnailLink.replace(/=s\d+$/, '=s600'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return new Response(thumb.body, { status: thumb.status, headers: { ...headers, 'Content-Type': 'image/jpeg' } });
}
