'use client';

import { useEffect, useState } from 'react';

import { AnalysisProgress } from './components/AnalysisProgress';
import { ScanError } from './components/ScanError';
import { ScanResults } from './components/ScanResults';
import { DemoImage, IdleOverview, ScanAction, ScanIntro } from './components/ScanSetup';
import { ANALYSIS_STEPS } from './scan-steps';
import { scanImage } from './scan';
import type { ScanResult, ScanStatus } from './scan.types';

export default function ScanButton() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (status !== 'loading') return;

    const interval = window.setInterval(() => {
      setActiveStep((currentStep) => Math.min(currentStep + 1, ANALYSIS_STEPS.length - 1));
    }, 1800);

    return () => window.clearInterval(interval);
  }, [status]);

  async function handleScan() {
    setStatus('loading');
    setResult(null);
    setErrorMessage('');
    setActiveStep(0);

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
    <section aria-labelledby="scan-title" className="w-full">
      <ScanIntro />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8">
        <DemoImage />

        <div className="min-w-0">
          <ScanAction status={status} onScan={handleScan} />
          {status === 'idle' && <IdleOverview />}
          {status === 'loading' && <AnalysisProgress activeStep={activeStep} />}
          {status === 'error' && <ScanError message={errorMessage} />}
          {status === 'success' && result && <ScanResults result={result} />}
        </div>
      </div>
    </section>
  );
}
