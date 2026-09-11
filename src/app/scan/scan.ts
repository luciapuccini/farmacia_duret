'use server';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const MODEL = 'gpt-5.6-luna';
const IMAGE_PATH = path.join(process.cwd(), 'src/app/scan/young-man-portrait.jpg');

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

Respondé en español de Argentina. El disclaimer debe aclarar siempre que el análisis de una foto es
limitado y no reemplaza una evaluación profesional.
`.trim();

const SkinScanResultSchema = z.object({
  summary: z.string(),
  visiblePatterns: z.array(z.string()),
  cosmeticSolutions: z.array(
    z.object({
      name: z.string(),
      rationale: z.string(),
      precautions: z.string(),
    }),
  ),
  medicalCheckFirst: z.object({
    suggested: z.boolean(),
    reason: z.string().nullable(),
  }),
  disclaimer: z.string(),
});

export async function scanImage() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const image = await readFile(IMAGE_PATH);
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
            image_url: `data:image/jpeg;base64,${image.toString('base64')}`,
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
