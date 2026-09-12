import { SCAN_ERROR_MESSAGE } from '@/services/scan/schema';
import { streamSkinScan } from '@/services/scan/server';
import type { ScanEvent } from '@/types/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }

  const abortController = new AbortController();
  const encoder = new TextEncoder();
  let closed = false;

  const cancel = () => abortController.abort();
  request.signal.addEventListener('abort', cancel, { once: true });
  if (request.signal.aborted) cancel();

  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    cancel();
  }, 90_000);

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ScanEvent) => {
        if (!closed && !request.signal.aborted) {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        }
      };

      try {
        for await (const event of streamSkinScan(abortController.signal)) send(event);
      } catch {
        send({
          type: 'error',
          message: timedOut
            ? 'El análisis está tardando más de lo esperado. Volvé a intentarlo en un momento.'
            : SCAN_ERROR_MESSAGE,
        });
      } finally {
        clearTimeout(timeout);
        request.signal.removeEventListener('abort', cancel);
        if (!closed) {
          closed = true;
          controller.close();
        }
      }
    },
    cancel() {
      closed = true;
      clearTimeout(timeout);
      request.signal.removeEventListener('abort', cancel);
      cancel();
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
