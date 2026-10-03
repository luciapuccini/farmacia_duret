// The OpenAI SDK ships this parser as an internal, vendored file. Keep this the only import of it,
// so that an SDK upgrade that moves the file breaks one module and its unit test.
import { partialParse } from 'openai/_vendor/partial-json-parser/parser';

import { catalogLinksForGuidePattern } from './scan-guide';
import {
  SkinScanResultSchema,
  type CosmeticSolution,
  type ScanEvent,
  type ScanResult,
  type ScanSolution,
} from './scan.schema';

const { summary, medicalCheckFirst, visiblePatterns, cosmeticSolutions } =
  SkinScanResultSchema.shape;

type PartialScanResult = Partial<Record<keyof ScanResult, unknown>>;

function toScanSolution({ guidePatternId, ...solution }: CosmeticSolution): ScanSolution {
  return {
    ...solution,
    products: guidePatternId ? catalogLinksForGuidePattern(guidePatternId) : [],
  };
}

/** Converts a complete scan result to its events, in schema order. */
export function resultToEvents(result: ScanResult): ScanEvent[] {
  return [
    { type: 'summary', text: result.summary },
    { type: 'medicalCheck', ...result.medicalCheckFirst },
    ...result.visiblePatterns.map((text): ScanEvent => ({ type: 'pattern', text })),
    ...result.cosmeticSolutions.map(
      (solution): ScanEvent => ({
        type: 'solution',
        ...toScanSolution(solution),
      }),
    ),
  ];
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Returns the events for the items that are complete in the partial JSON `snapshot`,
 * minus the first `emittedCount` events that the caller already sent.
 *
 * A field is complete when a later key exists. An array element is complete when a later
 * element or a later key exists. The last field is never complete here: the final response
 * completes it. Each complete item must pass its schema, or this function throws.
 */
export function extractCompletedEvents(snapshot: string, emittedCount: number): ScanEvent[] {
  if (!snapshot.trim()) return [];

  const partial = partialParse(snapshot) as PartialScanResult;
  const completed: ScanEvent[] = [];

  if ('medicalCheckFirst' in partial) {
    completed.push({ type: 'summary', text: summary.parse(partial.summary) });
  }

  if ('visiblePatterns' in partial) {
    completed.push({ type: 'medicalCheck', ...medicalCheckFirst.parse(partial.medicalCheckFirst) });
  }

  const patterns = asArray(partial.visiblePatterns);
  const completePatterns = 'cosmeticSolutions' in partial ? patterns : patterns.slice(0, -1);
  for (const pattern of completePatterns) {
    completed.push({ type: 'pattern', text: visiblePatterns.element.parse(pattern) });
  }

  const completeSolutions = asArray(partial.cosmeticSolutions).slice(0, -1);
  for (const solution of completeSolutions) {
    completed.push({
      type: 'solution',
      ...toScanSolution(cosmeticSolutions.element.parse(solution)),
    });
  }

  return completed.slice(emittedCount);
}
