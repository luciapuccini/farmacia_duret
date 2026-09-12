import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/scan/route';
import { SCAN_ERROR_MESSAGE } from '@/services/scan/schema';
import { skinScanResult } from '../fixtures/skinScan';

const { createStream } = vi.hoisted(() => ({ createStream: vi.fn() }));
vi.mock('openai', () => ({
  default: class {
    responses = { stream: createStream };
  },
}));
vi.mock('node:fs/promises', () => ({ readFile: vi.fn(async () => Buffer.from('test-image')) }));

function request(signal?: AbortSignal) {
  return new Request('http://localhost/api/scan', { method: 'POST', signal });
}

function stubStream(eventTypes: string[], status = 'completed', result: unknown = skinScanResult) {
  const stream = {
    ended: false,
    abort: vi.fn(),
    finalResponse: vi.fn(async () => ({ status, output_parsed: result })),
    async *[Symbol.asyncIterator]() {
      for (const type of eventTypes) yield { type, delta: 'private-output' };
      stream.ended = true;
    },
  };
  createStream.mockReturnValue(stream);
  return stream;
}

async function readEvents(response: Response) {
  return (await response.text())
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function stubWaitingStream() {
  createStream.mockImplementation((_params, { signal }: { signal: AbortSignal }) => ({
    ended: false,
    abort: vi.fn(),
    async *[Symbol.asyncIterator]() {
      yield { type: 'response.created' };
      await new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
      });
    },
  }));
}

describe('streamed skin scan route', () => {
  beforeEach(() => {
    vi.stubEnv('OPENAI_API_KEY', 'test-key');
    createStream.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('streams real milestones once and publishes only a complete validated result', async () => {
    stubStream([
      'response.created',
      'response.in_progress',
      'response.output_text.delta',
      'response.output_text.delta',
      'response.completed',
    ]);
    const response = await POST(request());

    expect(response.headers.get('content-type')).toContain('application/x-ndjson');
    expect(response.headers.get('cache-control')).toBe('no-store, no-transform');
    expect(await readEvents(response)).toEqual([
      { type: 'phase', phase: 'preparing' },
      { type: 'phase', phase: 'analyzing' },
      { type: 'phase', phase: 'composing' },
      { type: 'complete', result: skinScanResult },
    ]);
    expect(createStream).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-5.6-luna', store: false }),
      { signal: expect.any(AbortSignal) },
    );
  });

  it.each(['response.failed', 'response.incomplete', 'response.refusal.delta'])(
    'does not publish guidance after %s',
    async (event) => {
      const stream = stubStream(['response.created', event]);
      const events = await readEvents(await POST(request()));
      expect(events.at(-1)).toEqual({ type: 'error', message: SCAN_ERROR_MESSAGE });
      expect(events.some((item) => item.type === 'complete')).toBe(false);
      expect(stream.abort).toHaveBeenCalled();
    },
  );

  it.each([
    { status: 'in_progress', result: skinScanResult },
    { status: 'completed', result: null },
    { status: 'completed', result: { summary: 'Only a fragment' } },
  ])('rejects an incomplete or invalid final response: $status', async ({ status, result }) => {
    stubStream(['response.created'], status, result);
    const events = await readEvents(await POST(request()));
    expect(events.at(-1)).toEqual({ type: 'error', message: SCAN_ERROR_MESSAGE });
  });

  it('returns a friendly error without exposing configuration or upstream errors', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');
    expect(await readEvents(await POST(request()))).toEqual([
      { type: 'phase', phase: 'preparing' },
      { type: 'error', message: SCAN_ERROR_MESSAGE },
    ]);
    expect(createStream).not.toHaveBeenCalled();
  });

  it('aborts upstream work when the browser cancels the response', async () => {
    stubWaitingStream();
    const response = await POST(request());
    if (!response.body) throw new Error('Expected a response stream');
    const reader = response.body.getReader();
    await reader.read();
    await reader.read();
    const signal: AbortSignal = createStream.mock.calls[0][1].signal;
    await reader.cancel();
    expect(signal.aborted).toBe(true);
  });

  it('aborts upstream work when the request disconnects', async () => {
    stubWaitingStream();
    const controller = new AbortController();
    const response = await POST(request(controller.signal));
    if (!response.body) throw new Error('Expected a response stream');
    const reader = response.body.getReader();
    await reader.read();
    await reader.read();
    controller.abort();
    expect(createStream.mock.calls[0][1].signal.aborted).toBe(true);
    expect(await reader.read()).toEqual({ done: true, value: undefined });
  });

  it('ends a stalled stream with a recoverable timeout', async () => {
    vi.useFakeTimers();
    stubWaitingStream();
    const response = await POST(request());
    const events = readEvents(response);
    await vi.advanceTimersByTimeAsync(90_000);
    expect((await events).at(-1)).toEqual({
      type: 'error',
      message: 'El análisis está tardando más de lo esperado. Volvé a intentarlo en un momento.',
    });
    expect(createStream.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it('rejects cross-origin submissions before calling OpenAI', async () => {
    const response = await POST(
      new Request('http://localhost/api/scan', {
        method: 'POST',
        headers: { origin: 'https://another-site.example' },
      }),
    );
    expect(response.status).toBe(403);
    expect(createStream).not.toHaveBeenCalled();
  });
});
