import type { Metadata } from 'next';
import Link from 'next/link';
import { CAPS, FOCUS, INK, SERIF } from '../theme';

export const metadata: Metadata = { title: 'Privacidad · Sofi & Santi' };

// Required by Google's OAuth consent screen to publish the app.
export default function Privacidad() {
  return (
    <main className={`${SERIF} min-h-svh bg-[#fbf6e9] px-6 py-12 ${INK} antialiased`}>
      <div className="mx-auto max-w-xl space-y-5 leading-relaxed text-[#1f3a6e]/85">
        <Link href="/" className={`rounded ${CAPS} text-[10px] text-[#1f3a6e]/70 hover:text-[#3d5f9e] ${FOCUS}`}>← Volver</Link>
        <h1 className={`${CAPS} pt-6 text-lg ${INK}`}>Política de privacidad</h1>
        <p>Este sitio es la invitación al casamiento de Sofi y Santi (15 de noviembre de 2026).</p>
        <p>
          Las fotos que subís se guardan en una carpeta privada del Google Drive de los novios. Solo ellos pueden
          verlas; no se publican ni se comparten con terceros.
        </p>
        <p>
          El sitio no pide nombre, email ni cuenta, y no usa cookies ni herramientas de seguimiento. El acceso a
          Google Drive se limita a los archivos que el propio sitio crea.
        </p>
        <p>Si querés que se borre alguna foto tuya, pedíselo a los novios.</p>
      </div>
    </main>
  );
}
