import type { Metadata } from 'next';

import ScanExperience from './components/ScanExperience';

export const metadata: Metadata = {
  title: 'Una mirada a tu piel | Farmacia Duret',
};

export const runtime = 'nodejs';

export default function ScanPage() {
  return (
    <main className="mx-auto max-w-5xl py-4 sm:py-8">
      <ScanExperience />
    </main>
  );
}
