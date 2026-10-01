import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

import { extractCompletedEvents, resultToEvents } from '@/app/scan/scan-extractor';
import { SkinScanResultSchema, type ScanErrorCode, type ScanEvent } from '@/app/scan/scan.schema';
import { validateUpload } from '@/app/scan/upload';

export const runtime = 'nodejs';

const MODEL = 'gpt-5.6-luna';

const SYSTEM_PROMPT = `
Sos un asistente para una prueba de concepto de cuidado cosmético de la piel de una farmacia.

Analizá solamente características superficiales de la piel que sean visibles en la imagen. Describí
patrones observables con lenguaje prudente y sin afirmar diagnósticos, enfermedades, causas, gravedad
clínica ni certezas que una fotografía no permite establecer. No identifiques a la persona ni infieras
edad, origen, etnia, salud general u otros atributos personales.

Sugerí opciones cosméticas conservadoras y de bajo riesgo. No recomiendes medicamentos, dosis ni
tratamientos de enfermedades. Si observás algo que parezca intenso, preocupante o inadecuado para una
recomendación meramente cosmética, o si la imagen no permite evaluarlo con seguridad, marcá
medicalCheckFirst.suggested como true y explicá el motivo sin nombrar un diagnóstico.

Respondé en español de Argentina.
`.trim();

function errorResponse(code: ScanErrorCode, status: number) {
  return Response.json({ error: code }, { status });
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const images = formData?.getAll('image') ?? [];
  const image = images[0];

  if (images.length !== 1 || !(image instanceof File)) {
    return errorResponse('missing_image', 400);
  }

  const validation = validateUpload(image);
  if (!validation.ok) {
    return errorResponse(validation.reason, validation.reason === 'too_large' ? 413 : 400);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not configured.');
    return errorResponse('server_config', 500);
  }

  const imageBase64 = Buffer.from(await image.arrayBuffer()).toString('base64');
  const openai = new OpenAI({ apiKey });
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (event: ScanEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

      let emittedCount = 0;
      const writeNew = (events: ScanEvent[]) => {
        events.forEach(write);
        emittedCount += events.length;
      };

      write({ type: 'status', stage: 'analyzing' });

      try {
        const stream = openai.responses.stream(
          {
            model: MODEL,
            reasoning: { effort: 'medium' },
            instructions: SYSTEM_PROMPT,
            input: [
              {
                role: 'user',
                content: [
                  {
                    type: 'input_text',
                    text: 'Analizá los patrones visibles de la piel en esta imagen.',
                  },
                  {
                    type: 'input_image',
                    image_url: `data:${image.type};base64,${imageBase64}`,
                    detail: 'high',
                  },
                ],
              },
            ],
            text: { format: zodTextFormat(SkinScanResultSchema, 'skin_scan') },
            store: false,
          },
          // When the customer leaves or picks a new photo, the model stops generating.
          { signal: request.signal },
        );

        // Send each item as soon as it is complete in the JSON text written so far.
        let snapshot = '';
        for await (const event of stream) {
          if (event.type !== 'response.output_text.delta') continue;
          snapshot += event.delta;
          writeNew(extractCompletedEvents(snapshot, emittedCount));
        }

        // The last item is complete only in the final response. Check the full result first.
        const response = await stream.finalResponse();
        const result = SkinScanResultSchema.parse(response.output_parsed);
        writeNew(resultToEvents(result).slice(emittedCount));
        write({ type: 'done' });
      } catch (error) {
        // The customer cancelled the request. Nobody reads the stream, so do not write to it.
        if (request.signal.aborted) return;

        console.error('Skin scan failed.', error);
        write({ type: 'error', code: 'analysis_failed' });
      } finally {
        if (!request.signal.aborted) controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
