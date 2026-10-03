import { describe, expect, it } from 'vitest';

import {
  catalogLinksForGuidePattern,
  GUIDE_IDS,
  parseScanGuide,
  renderScanGuidePrompt,
  SCAN_GUIDE,
} from '@/app/scan/scan-guide';
import { resolveCatalogSelection } from '@/services/catalog/selection';

function slugsFromHref(href: string) {
  const url = new URL(href, 'https://farmacia.test');
  return {
    categorySlug: url.pathname.slice(1),
    subcategorySlug: url.searchParams.get('sc') ?? undefined,
    filterSlug: url.searchParams.get('f') ?? undefined,
  };
}

describe('scan guide', () => {
  it('exposes every guide id for the schema enum', () => {
    expect(GUIDE_IDS).toEqual(SCAN_GUIDE.map((entry) => entry.id));
  });

  it('resolves every guide entry to its catalog products', () => {
    for (const entry of SCAN_GUIDE) {
      const links = catalogLinksForGuidePattern(entry.id);
      expect(links.length).toBeGreaterThan(0);
      expect(links.map((link) => link.id)).toEqual(entry.productIds);
    }
  });

  it('links every product to a catalog page that matches its subcategory and filter', () => {
    const links = SCAN_GUIDE.flatMap((entry) => catalogLinksForGuidePattern(entry.id));

    for (const link of links) {
      const { categorySlug, subcategorySlug, filterSlug } = slugsFromHref(link.href);
      const selection = resolveCatalogSelection(categorySlug, subcategorySlug, filterSlug);

      expect(selection, link.href).toBeDefined();
      expect(selection?.subcategory, link.href).toBeDefined();
      expect(selection?.filter, link.href).toBeDefined();
    }
  });

  it('builds the link from the product catalog fields', () => {
    expect(catalogLinksForGuidePattern('lineas-finas')).toEqual([
      {
        id: '14',
        name: 'Crema Retinol Anti-Edad Día SPF30 50ml',
        brand: 'Neutrogena',
        image: '/images/products/14-day-face-cream.webp',
        href: '/dermocosmetica?sc=rostro&f=anti-edad',
      },
    ]);
  });

  it('rejects a guide that points to a product missing from the catalog', () => {
    const guide = [{ id: 'brillo-y-sebo', pattern: 'Brillo.', productIds: ['15', '999'] }];

    expect(() => parseScanGuide(guide)).toThrow(/999/);
  });

  it('rejects a guide with duplicated ids', () => {
    const entry = { id: 'brillo-y-sebo', pattern: 'Brillo.', productIds: ['15'] };

    expect(() => parseScanGuide([entry, entry])).toThrow(/Duplicate/);
  });

  it('rejects an entry with no products', () => {
    expect(() =>
      parseScanGuide([{ id: 'brillo-y-sebo', pattern: 'Brillo.', productIds: [] }]),
    ).toThrow();
  });

  it('rejects an unknown guide id', () => {
    expect(() => catalogLinksForGuidePattern('no-existe')).toThrow();
  });

  it('lists every guide id and its product names in the prompt text', () => {
    const prompt = renderScanGuidePrompt();

    for (const entry of SCAN_GUIDE) {
      expect(prompt).toContain(`${entry.id}:`);
      for (const link of catalogLinksForGuidePattern(entry.id)) {
        expect(prompt).toContain(link.name);
      }
    }
  });
});
