import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Great_Vibes } from 'next/font/google';
import './globals.css';

// Self-hosted by next/font (no external font requests, CSP-friendly).
const display = Bodoni_Moda({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });

export const metadata: Metadata = {
  title: 'Sofi & Santi · 15.11.2026',
  description: 'Nos casamos el domingo 15 de noviembre de 2026. Compartí tus fotos de la boda.',
};

export const viewport: Viewport = {
  themeColor: '#fbf6e9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
