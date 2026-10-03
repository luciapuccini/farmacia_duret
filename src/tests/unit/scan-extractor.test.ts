import { describe, expect, it } from 'vitest';

import { extractCompletedEvents, resultToEvents } from '@/app/scan/scan-extractor';
import { SkinScanResultSchema, type ScanEvent } from '@/app/scan/scan.schema';

const FULL_RESULT = JSON.stringify({
  summary: 'Piel con brillo leve.',
  medicalCheckFirst: { suggested: false, reason: null },
  visiblePatterns: ['Brillo en la zona T.', 'Poros visibles.'],
  cosmeticSolutions: [
    {
      name: 'Limpiador suave',
      rationale: 'Retira el sebo.',
      precautions: 'No frotar.',
      guidePatternId: 'brillo-y-sebo',
    },
    {
      name: 'Protector solar',
      rationale: 'Protege la piel.',
      precautions: 'Renovar.',
      guidePatternId: null,
    },
  ],
});

const MICELLAR_WATER_LINK = {
  id: '15',
  name: 'Agua Micelar Sensibio H2O 500ml',
  brand: 'Bioderma',
  image: '/images/products/15-micellar-water.webp',
  href: '/dermocosmetica?sc=rostro&f=limpieza',
};

const CLEANSER_EVENT = {
  type: 'solution',
  name: 'Limpiador suave',
  rationale: 'Retira el sebo.',
  precautions: 'No frotar.',
  products: [MICELLAR_WATER_LINK],
};

const SUNSCREEN_EVENT = {
  type: 'solution',
  name: 'Protector solar',
  rationale: 'Protege la piel.',
  precautions: 'Renovar.',
  products: [],
};

/** Cuts the full JSON text just after the first occurrence of `marker`. */
function snapshotAfter(marker: string) {
  const index = FULL_RESULT.indexOf(marker);
  if (index === -1) throw new Error(`Marker not found: ${marker}`);
  return FULL_RESULT.slice(0, index + marker.length);
}

describe('extractCompletedEvents', () => {
  it('emits nothing for an empty snapshot or a half-written summary', () => {
    expect(extractCompletedEvents('', 0)).toEqual([]);
    expect(extractCompletedEvents(snapshotAfter('Piel con'), 0)).toEqual([]);
    expect(extractCompletedEvents(snapshotAfter('Piel con brillo leve."'), 0)).toEqual([]);
  });

  it('emits the summary when the next key starts', () => {
    expect(extractCompletedEvents(snapshotAfter('"medicalCheckFirst":{"sugg'), 0)).toEqual([
      { type: 'summary', text: 'Piel con brillo leve.' },
    ]);
  });

  it('emits an array element when the next element starts', () => {
    const events = extractCompletedEvents(snapshotAfter('"Poros'), 0);

    expect(events.at(-1)).toEqual({ type: 'pattern', text: 'Brillo en la zona T.' });
    expect(events.filter((event) => event.type === 'pattern')).toHaveLength(1);
  });

  it('emits the last array element when the next key starts', () => {
    const events = extractCompletedEvents(snapshotAfter('"cosmeticSolutions":['), 0);

    expect(events.filter((event) => event.type === 'pattern')).toEqual([
      { type: 'pattern', text: 'Brillo en la zona T.' },
      { type: 'pattern', text: 'Poros visibles.' },
    ]);
  });

  it('does not emit the last field, because the final response completes it', () => {
    const events = extractCompletedEvents(FULL_RESULT, 0);

    const solutions = events.filter((event) => event.type === 'solution');
    expect(solutions).toEqual([CLEANSER_EVENT]);
    expect(solutions[0]).not.toHaveProperty('guidePatternId');
  });

  it('emits each item one time and in schema order across consecutive snapshots', () => {
    const emitted: ScanEvent[] = [];

    for (let length = 1; length <= FULL_RESULT.length; length += 1) {
      emitted.push(...extractCompletedEvents(FULL_RESULT.slice(0, length), emitted.length));
    }

    expect(emitted.map((event) => event.type)).toEqual([
      'summary',
      'medicalCheck',
      'pattern',
      'pattern',
      'solution',
    ]);
    expect(emitted[1]).toEqual({ type: 'medicalCheck', suggested: false, reason: null });
  });

  it('rejects a guide pattern id that is not in the guide', () => {
    const snapshot = FULL_RESULT.replace('brillo-y-sebo', 'no-existe');

    expect(() => extractCompletedEvents(snapshot, 0)).toThrow();
  });

  it('rejects a completed item that does not match its schema', () => {
    const snapshot = '{"summary":42,"medicalCheckFirst":{';

    expect(() => extractCompletedEvents(snapshot, 0)).toThrow();
  });
});

describe('resultToEvents', () => {
  it('resolves catalog products for each solution and drops the guide pattern id', () => {
    const result = SkinScanResultSchema.parse(JSON.parse(FULL_RESULT));
    const solutions = resultToEvents(result).filter((event) => event.type === 'solution');

    expect(solutions).toEqual([CLEANSER_EVENT, SUNSCREEN_EVENT]);
    for (const solution of solutions) expect(solution).not.toHaveProperty('guidePatternId');
  });
});
