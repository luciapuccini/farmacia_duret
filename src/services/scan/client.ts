import type { ScanEvent, ScanPhase, SkinScanResult } from '@/types/types';
import { SCAN_ERROR_MESSAGE, ScanEventSchema } from './schema';

export async function requestSkinScan(
  signal: AbortSignal,
  onPhase: (phase: ScanPhase) => void,
): Promise<SkinScanResult> {
  const response = await fetch('/api/scan', { method: 'POST', signal });
  if (!response.ok || !response.body) throw new Error(SCAN_ERROR_MESSAGE);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  function readEvent(line: string): ScanEvent {
    try {
      return ScanEventSchema.parse(JSON.parse(line));
    } catch {
      throw new Error(SCAN_ERROR_MESSAGE);
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read();
      signal.throwIfAborted();
      buffer += decoder.decode(value, { stream: !done });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      if (done && buffer.trim()) lines.push(buffer);

      for (const line of lines) {
        if (!line.trim()) continue;
        const event = readEvent(line);
        if (event.type === 'error') throw new Error(event.message);
        if (event.type === 'complete') return event.result;
        onPhase(event.phase);
      }

      if (done) throw new Error(SCAN_ERROR_MESSAGE);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
