import type { Metadata } from 'next';

import ScanButton from './ScanButton';

export const metadata: Metadata = {
  title: 'Scan | Farmacia Duret',
};

export const runtime = 'nodejs';

export default function ScanPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center py-16">
      <ScanButton />
    </main>
  );
}
