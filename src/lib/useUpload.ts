'use client';

import { useState } from 'react';
import { isPhoto, LIMITS, mb } from './limits';

export type Pending = { file: File; url: string };
export type UploadStatus = { done: number; total: number; errors: string[] };

/** Text for guests explaining the limits. */
export const LIMITS_HINT = `Fotos de hasta ${mb(LIMITS.photoSourceBytes)}.`;

// Re-encodes as JPEG at up to 2K (LIMITS.photoMaxSide), lowering quality until it fits LIMITS.photoBytes.
// Returns the original if the browser can't decode it (e.g. HEIC outside Safari) and it already fits.
async function compress(file: File): Promise<File | null> {
  try {
    const img = await createImageBitmap(file);
    const scale = Math.min(1, LIMITS.photoMaxSide / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.close();
    for (const q of LIMITS.photoQualities) {
      const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', q));
      if (blob && blob.size <= LIMITS.photoBytes) {
        return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
      }
    }
    return null;
  } catch {
    return file.size <= LIMITS.photoBytes ? file : null;
  }
}

// Returns the photo ready to upload, or an error message.
async function prepare(file: File): Promise<File | string> {
  if (!isPhoto(file.name, file.type)) return `${file.name}: solo se pueden subir fotos.`;
  if (file.size > LIMITS.photoSourceBytes) return `${file.name}: la foto es demasiado pesada (${mb(file.size)}).`;
  return (await compress(file)) ?? `${file.name}: no se pudo procesar la foto. Probá con otra.`;
}

async function send(file: File): Promise<string | null> {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body }).catch(() => null);
  if (res?.ok) return null;
  return (await res?.json().catch(() => null))?.error ?? 'error de conexión';
}

/** Pick → validate/compress → preview → confirm → upload. The upload page only adds styling. */
export function useUpload() {
  const [pending, setPending] = useState<Pending[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [preparing, setPreparing] = useState(false);
  const [status, setStatus] = useState<UploadStatus | null>(null);

  function discard() {
    pending.forEach(p => URL.revokeObjectURL(p.url));
    setPending([]);
  }

  // Use as <input onChange={pick} />
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? [...e.target.files] : [];
    e.target.value = ''; // allow picking the same file again
    if (!files.length) return;
    discard();
    setStatus(null);
    setPreparing(true);
    const results = await Promise.all(files.map(prepare));
    setPreparing(false);
    setPending(results.filter((r): r is File => typeof r !== 'string').map(file => ({ file, url: URL.createObjectURL(file) })));
    setRejected(results.filter((r): r is string => typeof r === 'string'));
  }

  async function save() {
    const list = pending.map(p => p.file);
    discard();
    setRejected([]);
    const errors: string[] = [];
    for (const [i, file] of list.entries()) {
      setStatus({ done: i, total: list.length, errors: [...errors] });
      const error = await send(file);
      if (error) errors.push(`${file.name}: ${error}`);
    }
    setStatus({ done: list.length, total: list.length, errors });
  }

  const busy = !!status && status.done < status.total;
  return { pending, rejected, status, busy, preparing, picking: !busy && !preparing && pending.length === 0, pick, discard, save };
}
