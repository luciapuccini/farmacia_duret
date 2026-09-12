'use client';

import { useEffect, useRef, useState } from 'react';

import { requestSkinScan } from '@/services/scan/client';
import { SCAN_ERROR_MESSAGE } from '@/services/scan/schema';
import type { ScanPhase, SkinScanResult } from '@/types/types';

export type ScanStatus = 'idle' | 'running' | 'success' | 'error' | 'cancelled';

export function useSkinScan() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [phase, setPhase] = useState<ScanPhase>('preparing');
  const [result, setResult] = useState<SkinScanResult | null>(null);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => () => activeRequest.current?.abort(), []);

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [status, startedAt]);

  async function startScan() {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    setStatus('running');
    setPhase('preparing');
    setResult(null);
    setError('');
    setElapsed(0);
    setStartedAt(Date.now());

    // Also bound the browser's wait if the connection stalls before a server error arrives.
    const timeout = setTimeout(() => controller.abort('timeout'), 100_000);
    try {
      const nextResult = await requestSkinScan(controller.signal, (nextPhase) => {
        if (activeRequest.current === controller) setPhase(nextPhase);
      });
      if (activeRequest.current !== controller) return;
      setResult(nextResult);
      setStatus('success');
    } catch (cause) {
      if (activeRequest.current !== controller) return;
      if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
      setError(
        controller.signal.reason === 'timeout'
          ? 'El análisis está tardando más de lo esperado. Volvé a intentarlo en un momento.'
          : cause instanceof Error
            ? cause.message
            : SCAN_ERROR_MESSAGE,
      );
      setStatus('error');
    } finally {
      clearTimeout(timeout);
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }

  function cancelScan() {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setStatus('cancelled');
  }

  return { status, phase, result, error, elapsed, startScan, cancelScan };
}
