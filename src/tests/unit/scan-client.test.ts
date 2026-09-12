import { afterEach, describe, expect, it, vi } from 'vitest';

import { requestSkinScan } from '@/services/scan/client';
import { SCAN_ERROR_MESSAGE } from '@/services/scan/schema';
import { skinScanResult } from '../fixtures/skinScan';

function stubChunks(chunks: Uint8Array[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(
          new ReadableStream({
            start(controller) {
              for (const chunk of chunks) controller.enqueue(chunk);
              controller.close();
            },
          }),
        ),
    ),
  );
}

describe('skin scan stream reader', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('handles split JSON, split UTF-8, multiple events, and an unterminated final line', async () => {
    const text = [
      JSON.stringify({ type: 'phase', phase: 'analyzing' }),
      JSON.stringify({ type: 'phase', phase: 'composing' }),
      JSON.stringify({ type: 'complete', result: skinScanResult }),
    ].join('\n');
    const bytes = new TextEncoder().encode(text);
    stubChunks(Array.from(bytes, (byte) => new Uint8Array([byte])));
    const onPhase = vi.fn();
    await expect(requestSkinScan(new AbortController().signal, onPhase)).resolves.toEqual(
      skinScanResult,
    );
    expect(onPhase.mock.calls).toEqual([['analyzing'], ['composing']]);
  });

  it.each([
    '',
    '{"type":"phase","phase":"analyzing"}\n',
    '{"type":"complete","result":{"summary":"unfinished"}}\n',
    'invalid json\n',
  ])('never treats a broken or incomplete stream as success: %s', async (body) => {
    stubChunks([new TextEncoder().encode(body)]);
    await expect(requestSkinScan(new AbortController().signal, vi.fn())).rejects.toThrow(
      SCAN_ERROR_MESSAGE,
    );
  });

  it('surfaces recoverable server errors', async () => {
    stubChunks([
      new TextEncoder().encode(
        JSON.stringify({ type: 'error', message: 'Volvé a intentarlo.' }) + '\n',
      ),
    ]);
    await expect(requestSkinScan(new AbortController().signal, vi.fn())).rejects.toThrow(
      'Volvé a intentarlo.',
    );
  });

  it('handles non-success HTTP responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 503 })),
    );
    await expect(requestSkinScan(new AbortController().signal, vi.fn())).rejects.toThrow(
      SCAN_ERROR_MESSAGE,
    );
  });

  it('does not publish a result after cancellation', async () => {
    stubChunks([
      new TextEncoder().encode(JSON.stringify({ type: 'complete', result: skinScanResult })),
    ]);
    const controller = new AbortController();
    controller.abort();
    await expect(requestSkinScan(controller.signal, vi.fn())).rejects.toThrow();
  });
});
