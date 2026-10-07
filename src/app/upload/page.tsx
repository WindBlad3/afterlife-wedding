import type { Metadata } from 'next';
import Upload from './Upload';

export const metadata: Metadata = { title: 'Compartí tus fotos · Sofi & Santi' };

export default function Page() {
  return <Upload />;
}
