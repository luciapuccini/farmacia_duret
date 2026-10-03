import { z } from 'zod';

import { GUIDE_IDS, type CatalogProductLink } from './scan-guide';

// Key order is also the reveal order: the model writes the JSON in schema order.
export const SkinScanResultSchema = z.object({
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
      guidePatternId: z.enum(GUIDE_IDS).nullable(),
    }),
  ),
});

export type ScanResult = z.infer<typeof SkinScanResultSchema>;
export type CosmeticSolution = ScanResult['cosmeticSolutions'][number];

export type ScanSolution = Omit<CosmeticSolution, 'guidePatternId'> & {
  products: CatalogProductLink[];
};

export type ScanErrorCode =
  | 'missing_image'
  | 'unsupported_type'
  | 'too_large'
  | 'server_config'
  | 'analysis_failed';

/** Streaming contract of POST /api/scan. One JSON object per NDJSON line. */
export type ScanEvent =
  | { type: 'status'; stage: 'analyzing' }
  | { type: 'summary'; text: string }
  | { type: 'medicalCheck'; suggested: boolean; reason: string | null }
  | { type: 'pattern'; text: string }
  | ({ type: 'solution' } & ScanSolution)
  | { type: 'done' }
  | { type: 'error'; code: ScanErrorCode };
