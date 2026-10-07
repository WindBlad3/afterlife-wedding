'use client';

import Link from 'next/link';
import { LIMITS_HINT, useUpload } from '@/lib/useUpload';
import { ACCENT, BTN, BTN_OUTLINE, CAMERA, CAPS, Divider, FOCUS, Icon, INK, NOISE, SCRIPT, SERIF } from '../theme';

// Inputs are sr-only (still keyboard-focusable); the label shows the focus ring via has-focus-visible.
const LABEL_FOCUS = 'has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-[#1f3a6e]';
const ERROR = 'text-sm text-[#a33a3a]';
const IMAGES = <path d="M7 3h14v14H7V3ZM3 7v14h14M7 14l4-4 3 3 2-2 5 5M16.5 8.5h.01" />;

export default function Upload() {
  const { pending, rejected, status, busy, preparing, picking, pick, discard, save } = useUpload();

  return (
    <main className={`${SERIF} relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-[#fbf6e9] px-6 pb-24 pt-8 text-center ${INK} antialiased`}>
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_at_50%_20%,#ffffff_0%,#fdf9ef_50%,#fbf6e9_85%)]">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#3d5f9e]/8 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply" style={{ backgroundImage: NOISE }} />
      </div>

      <Link href="/" className={`self-start rounded ${CAPS} text-[10px] text-[#1f3a6e]/70 transition hover:text-[#3d5f9e] ${FOCUS}`}>
        ← Volver
      </Link>

      <Icon className="mt-14 h-10 w-10">{CAMERA}</Icon>
      <h1 className="mt-6 flex flex-col items-center">
        <span className={`${CAPS} text-xs text-[#1f3a6e]/70`}>Compartí</span>
        <span className={`${SCRIPT} ${ACCENT} mt-1 text-5xl leading-tight sm:text-6xl`}>Tus fotos</span>
      </h1>
      <p className="mt-8 max-w-md leading-relaxed text-[#1f3a6e]/80">
        Sacá una foto ahora o elegí las que ya tengas en tu celular.
      </p>
      <p className="mt-3 max-w-md text-xs italic text-[#1f3a6e]/60">{LIMITS_HINT}</p>

      <Divider className="my-10" />

      {rejected.length > 0 && (
        <div className="mb-8 max-w-md space-y-1" role="alert">
          {rejected.map(e => <p key={e} className={ERROR}>{e}</p>)}
        </div>
      )}

      {picking && (
        <div className="flex w-full max-w-xs flex-col gap-4">
          <label className={`${BTN} ${LABEL_FOCUS}`}>
            <Icon className="h-5 w-5">{CAMERA}</Icon> Sacar foto
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={pick} />
          </label>
          <label className={`${BTN_OUTLINE} ${LABEL_FOCUS}`}>
            <Icon className="h-5 w-5">{IMAGES}</Icon> Elegir fotos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={pick} />
          </label>
        </div>
      )}

      {pending.length > 0 && (
        <div className="w-full max-w-md">
          <div className={pending.length === 1 ? '' : 'grid grid-cols-2 gap-3'}>
            {pending.map(p => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.url} src={p.url} alt="Vista previa" className="w-full rounded-2xl bg-white object-cover shadow-md ring-1 ring-[#1f3a6e]/15" />
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={discard} className={`${BTN_OUTLINE} ${FOCUS} flex-1 px-4`}>Descartar</button>
            <button type="button" onClick={save} className={`${BTN} ${FOCUS} flex-1 px-4`}>
              Guardar{pending.length > 1 ? ` (${pending.length})` : ''}
            </button>
          </div>
        </div>
      )}

      {preparing && <p className={`${CAPS} text-xs text-[#1f3a6e]/80`} aria-live="polite">Preparando…</p>}

      {status && (
        <div className="mt-10 max-w-md" aria-live="polite">
          {busy ? (
            <p className={`${CAPS} text-xs text-[#1f3a6e]/80`}>Subiendo {status.done + 1} de {status.total}…</p>
          ) : status.errors.length ? (
            <p className="text-lg text-[#1f3a6e]/90">Se subieron {status.total - status.errors.length} de {status.total}.</p>
          ) : (
            <p className={`${SCRIPT} ${ACCENT} text-5xl leading-tight`}>¡Listo, gracias!</p>
          )}
          {status.errors.map(e => <p key={e} className={`${ERROR} mt-1`}>{e}</p>)}
        </div>
      )}
    </main>
  );
}
