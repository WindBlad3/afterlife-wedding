import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GALLERY_ENABLED } from '@/lib/flags';
import { getDrive } from '@/lib/server';

export const dynamic = 'force-dynamic';

export default async function Gallery() {
  if (!GALLERY_ENABLED) notFound();
  const conn = await getDrive();
  // ponytail: single page of 1000; add pageToken paging if the album grows past that.
  const folder = conn && (await conn.photosFolder());
  const files = conn && folder
    ? (await conn.drive.files.list({
        q: `'${folder}' in parents and trashed = false`,
        fields: 'files(id,mimeType)',
        orderBy: 'createdTime desc',
        pageSize: 1000,
      })).data.files ?? []
    : [];

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: 'linear-gradient(135deg, #faf8f5 0%, #f5ede8 50%, #faf8f5 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-amber-600">← Volver</Link>
          <Link href="/upload" className="btn-wedding text-sm">📷 Subir fotos</Link>
        </div>
        <h1 className="text-center mb-10" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem' }}>
          Nuestro <span style={{ color: '#c9a84c' }}>álbum</span>
        </h1>

        {!files.length ? (
          <p className="text-center text-gray-500">
            {conn ? 'Todavía no hay fotos. ¡Subí la primera!' : 'El álbum todavía no está conectado.'}
          </p>
        ) : (
          <div className="photo-grid">
            {files.map(f => (
              <a key={f.id} href={`/api/photo/${f.id}?full=1`} target="_blank" className="relative block aspect-square overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/photo/${f.id}`} alt="" loading="lazy" className="w-full h-full object-cover" />
                {f.mimeType?.startsWith('video/') && (
                  <span className="absolute inset-0 flex items-center justify-center text-4xl text-white drop-shadow">▶</span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
