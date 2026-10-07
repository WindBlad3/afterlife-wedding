import { Readable } from 'stream';
import type { ReadableStream as WebStream } from 'stream/web';
import { isPhoto, LIMITS, mb } from '@/lib/limits';
import { getDrive } from '@/lib/server';

const fail = (error: string, status: number) => Response.json({ error }, { status });

// One photo per request (already compressed by the browser, ≤ LIMITS.photoBytes).
export async function POST(req: Request) {
  // Reject oversized bodies before reading them.
  if (Number(req.headers.get('content-length') ?? 0) > LIMITS.photoBytes + 64 * 1024) {
    return fail(`La foto supera el máximo de ${mb(LIMITS.photoBytes)}.`, 413);
  }

  const conn = await getDrive();
  if (!conn) return fail('El álbum todavía no está conectado.', 503);

  const file = (await req.formData().catch(() => null))?.get('file');
  if (!(file instanceof File)) return fail('Falta la foto.', 400);
  if (!isPhoto(file.name, file.type)) return fail('Solo se pueden subir fotos.', 415);
  if (file.size > LIMITS.photoBytes) return fail(`La foto supera el máximo de ${mb(LIMITS.photoBytes)}.`, 413);

  // ponytail: count + quota checks aren't atomic; concurrent uploads can overshoot by a few files.
  const folder = await conn.photosFolder();
  const [existing, about] = await Promise.all([
    conn.drive.files.list({ q: `'${folder}' in parents and trashed = false`, fields: 'files(id)', pageSize: LIMITS.maxPhotos }),
    conn.drive.about.get({ fields: 'storageQuota(limit,usage)' }),
  ]);
  if ((existing.data.files?.length ?? 0) >= LIMITS.maxPhotos) {
    return fail(`Ya se alcanzó el máximo de ${LIMITS.maxPhotos} fotos del álbum.`, 409);
  }
  const { limit, usage } = about.data.storageQuota ?? {};
  if (limit && Number(limit) - Number(usage ?? 0) - file.size < LIMITS.reserveBytes) {
    return fail('El álbum se quedó sin espacio.', 507);
  }

  await conn.drive.files.create({
    requestBody: { name: `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_').slice(-80)}`, parents: [folder] },
    media: { mimeType: file.type, body: Readable.fromWeb(file.stream() as WebStream) },
    fields: 'id',
  });
  return Response.json({ ok: true });
}
