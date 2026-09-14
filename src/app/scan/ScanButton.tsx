'use client';

import { useState } from 'react';

import { Button } from '@/components/ui';

import { scanImage } from './scan';

type ScanResult = Awaited<ReturnType<typeof scanImage>>;
type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ScanButton() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleScan() {
    setStatus('loading');
    setResult(null);
    setErrorMessage('');

    try {
      const scanResult = await scanImage();
      setResult(scanResult);
      setStatus('success');
    } catch {
      setErrorMessage('No pudimos analizar la imagen. Revisá la configuración e intentá de nuevo.');
      setStatus('error');
    }
  }

  return (
    <section className="flex w-full max-w-3xl flex-col items-center gap-6">
      <Button onClick={handleScan} disabled={status === 'loading'}>
        {status === 'loading' ? 'Analizando…' : 'Analizar imagen'}
      </Button>

      {status === 'error' && (
        <p role="alert" className="text-center text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {status === 'success' && result && (
        <pre className="w-full overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm whitespace-pre-wrap text-slate-100">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
