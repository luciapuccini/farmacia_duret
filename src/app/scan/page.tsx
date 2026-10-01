import type { Metadata } from 'next';

import ScanFlow from './ScanFlow';

export const metadata: Metadata = {
  title: 'Análisis cosmético de piel | Farmacia Duret',
  description: 'Sacá o elegí una foto de tu piel y recibí una orientación cosmética prudente.',
};

export const runtime = 'nodejs';

export default function ScanPage() {
  return (
    <main className="mx-auto w-full max-w-5xl py-4 sm:py-8 lg:py-12">
      <ScanFlow />
    </main>
  );
}
