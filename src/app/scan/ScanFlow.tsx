'use client';

import { useEffect, useState } from 'react';

import { AnalysisProgress } from './components/AnalysisProgress';
import { ScanDisclaimer } from './components/ScanDisclaimer';
import { ScanError } from './components/ScanError';
import { EMPTY_SCAN_ITEMS, ScanResults, type ScanItems } from './components/ScanResults';
import { PhotoPicker, ScanAction, ScanIntro } from './components/ScanSetup';
import { ANALYSIS_STEPS } from './scan-steps';
import type { ScanErrorCode, ScanEvent } from './scan.schema';
import { validateUpload, type UploadRejection } from './upload';

export type ScanStatus = 'idle' | 'selected' | 'streaming' | 'done' | 'error';

const UPLOAD_MESSAGES: Record<UploadRejection, string> = {
  unsupported_type: 'Elegí una foto JPG, PNG o WEBP.',
  too_large: 'La foto pesa más de 10 MB. Elegí una foto más liviana.',
};

const ERROR_MESSAGES: Record<ScanErrorCode, string> = {
  missing_image: 'No recibimos la foto. Elegila de nuevo.',
  unsupported_type: UPLOAD_MESSAGES.unsupported_type,
  too_large: UPLOAD_MESSAGES.too_large,
  server_config: 'El análisis no está disponible en este momento.',
  analysis_failed: 'No pudimos analizar la foto. Intentá de nuevo.',
};

class ScanRequestError extends Error {
  constructor(readonly code: ScanErrorCode) {
    super(code);
  }
}

function appendEvent(items: ScanItems, event: ScanEvent): ScanItems {
  switch (event.type) {
    case 'summary':
      return { ...items, summary: event.text };
    case 'medicalCheck':
      return { ...items, medicalCheck: { suggested: event.suggested, reason: event.reason } };
    case 'pattern':
      return { ...items, patterns: [...items.patterns, event.text] };
    case 'solution': {
      const { name, rationale, precautions } = event;
      return { ...items, solutions: [...items.solutions, { name, rationale, precautions }] };
    }
    default:
      return items;
  }
}

async function readScanStream(response: Response, onEvent: (event: ScanEvent) => void) {
  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => null)) as { error?: ScanErrorCode } | null;
    throw new ScanRequestError(body?.error ?? 'analysis_failed');
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.trim()) onEvent(JSON.parse(line) as ScanEvent);
    }
  }
}

export default function ScanFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [items, setItems] = useState<ScanItems>(EMPTY_SCAN_ITEMS);
  const [uploadError, setUploadError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Revoke the old preview URL when it is replaced, and on unmount.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (status !== 'streaming') return;

    const interval = window.setInterval(() => {
      setActiveStep((currentStep) => Math.min(currentStep + 1, ANALYSIS_STEPS.length - 1));
    }, 1800);

    return () => window.clearInterval(interval);
  }, [status]);

  function handlePick(pickedFile: File) {
    const validation = validateUpload(pickedFile);
    if (!validation.ok) {
      setUploadError(UPLOAD_MESSAGES[validation.reason]);
      return;
    }

    setUploadError('');
    setFile(pickedFile);
    setPreviewUrl(URL.createObjectURL(pickedFile));
    setItems(EMPTY_SCAN_ITEMS);
    setStatus('selected');
  }

  async function handleAnalyze() {
    if (!file) return;

    setStatus('streaming');
    setItems(EMPTY_SCAN_ITEMS);
    setErrorMessage('');
    setActiveStep(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      let isDone = false;
      const response = await fetch('/api/scan', { method: 'POST', body: formData });

      await readScanStream(response, (event) => {
        if (event.type === 'error') throw new ScanRequestError(event.code);
        if (event.type === 'done') isDone = true;
        setItems((currentItems) => appendEvent(currentItems, event));
      });

      if (!isDone) throw new ScanRequestError('analysis_failed');
      setStatus('done');
    } catch (error) {
      const code = error instanceof ScanRequestError ? error.code : 'analysis_failed';
      setItems(EMPTY_SCAN_ITEMS);
      setErrorMessage(ERROR_MESSAGES[code]);
      setStatus('error');
    }
  }

  return (
    <section aria-labelledby="scan-title" className="w-full">
      <ScanIntro />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8">
        <PhotoPicker
          previewUrl={previewUrl}
          disabled={status === 'streaming'}
          errorMessage={uploadError}
          onPick={handlePick}
        />

        <div className="min-w-0">
          {file && <ScanAction status={status} onAnalyze={handleAnalyze} />}
          {status === 'streaming' && <AnalysisProgress activeStep={activeStep} />}
          {status === 'error' && <ScanError message={errorMessage} />}
          {status === 'done' && <ScanResults items={items} />}
          <ScanDisclaimer />
        </div>
      </div>
    </section>
  );
}
