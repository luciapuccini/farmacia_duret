import { z } from 'zod';

export const SkinScanResultSchema = z.object({
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

export const ScanPhaseSchema = z.enum(['preparing', 'analyzing', 'composing']);

export const ScanEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('phase'), phase: ScanPhaseSchema }),
  z.object({ type: z.literal('complete'), result: SkinScanResultSchema }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export const SCAN_ERROR_MESSAGE = 'No pudimos completar el análisis. Podés volver a intentarlo.';
