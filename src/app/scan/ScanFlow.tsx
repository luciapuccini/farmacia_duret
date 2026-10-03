'use client';

import { useEffect, useRef, useState } from 'react';

import { ScanDisclaimer } from './components/ScanDisclaimer';
import { ScanError } from './components/ScanError';
import { EMPTY_SCAN_ITEMS, ScanResults, type ScanItems } from './components/ScanResults';
import { PhotoPicker, ScanAction, ScanIntro } from './components/ScanSetup';
import type { ScanErrorCode, ScanEvent, ScanSolution } from './scan.schema';
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
      const { name, rationale, precautions, products } = event;
      const solution: ScanSolution = { name, rationale, precautions, products };
      return { ...items, solutions: [...items.solutions, solution] };
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
  // The running scan request. A new pick or leaving the page cancels it.
  const scanRequestRef = useRef<AbortController | null>(null);

  // Revoke the old preview URL when it is replaced, and on unmount.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => () => scanRequestRef.current?.abort(), []);

  function handlePick(pickedFile: File) {
    const validation = validateUpload(pickedFile);
    if (!validation.ok) {
      setUploadError(UPLOAD_MESSAGES[validation.reason]);
      return;
    }

    scanRequestRef.current?.abort();
    setUploadError('');
    setFile(pickedFile);
    setPreviewUrl(URL.createObjectURL(pickedFile));
    setItems(EMPTY_SCAN_ITEMS);
    setStatus('selected');
  }

  async function handleAnalyze() {
    if (!file) return;

    const scanRequest = new AbortController();
    scanRequestRef.current = scanRequest;

    setStatus('streaming');
    setItems(EMPTY_SCAN_ITEMS);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      let isDone = false;
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
        signal: scanRequest.signal,
      });

      await readScanStream(response, (event) => {
        if (scanRequest.signal.aborted) return;
        if (event.type === 'error') throw new ScanRequestError(event.code);
        if (event.type === 'done') isDone = true;
        setItems((currentItems) => appendEvent(currentItems, event));
      });

      if (!isDone) throw new ScanRequestError('analysis_failed');
      setStatus('done');
    } catch (error) {
      // A cancelled scan is not an error: a new pick or unmount already replaced it.
      if (scanRequest.signal.aborted) return;

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
          isCompact={status !== 'idle' && status !== 'selected'}
          errorMessage={uploadError}
          onPick={handlePick}
        />

        <div className="min-w-0">
          {file && status !== 'error' && <ScanAction status={status} onAnalyze={handleAnalyze} />}
          {(status === 'streaming' || status === 'done') && (
            <ScanResults items={items} isStreaming={status === 'streaming'} />
          )}
          {status === 'error' && <ScanError message={errorMessage} onRetry={handleAnalyze} />}
          <ScanDisclaimer />
        </div>
      </div>
    </section>
  );
}
