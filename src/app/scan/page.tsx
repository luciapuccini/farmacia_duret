import type { Metadata } from 'next';

import ScanButton from './ScanButton';

export const metadata: Metadata = {
  title: 'Análisis cosmético de piel | Farmacia Duret',
  description:
    'Una demostración de análisis visual para orientar una rutina cosmética con recomendaciones prudentes.',
};

export const runtime = 'nodejs';

export default function ScanPage() {
  return (
    <main className="mx-auto w-full max-w-5xl py-4 sm:py-8 lg:py-12">
      <ScanButton />
    </main>
  );
}
