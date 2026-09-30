'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import demoImage from './young-man-portrait.jpg';

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

const SkinScanResultSchema = z.object({
  summary: z.string(),
  medicalCheckFirst: z.object({
    suggested: z.boolean(),
    reason: z.string().nullable(),
  }),
  visiblePatterns: z.array(z.string()),
  cosmeticSolutions: z.array(
    z.object({
      name: z.string(),
      rationale: z.string(),
      precautions: z.string(),
    }),
  ),
});

async function readDemoImageAsBase64() {
  const { env } = getCloudflareContext();
  const response = await env.ASSETS.fetch(new URL(demoImage.src, 'https://assets.local'));

  if (!response.ok) {
    throw new Error(`Could not read the demo image: ${response.status}.`);
  }

  return Buffer.from(await response.arrayBuffer()).toString('base64');
}

export async function scanImage() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const image = await readDemoImageAsBase64();
  const openai = new OpenAI({ apiKey });
  const response = await openai.responses.parse({
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
            image_url: `data:image/jpeg;base64,${image}`,
            detail: 'high',
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(SkinScanResultSchema, 'skin_scan'),
    },
    store: false,
  });

  if (!response.output_parsed) {
    throw new Error('OpenAI returned no structured scan result.');
  }

  return response.output_parsed;
}
