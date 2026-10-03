import { z } from 'zod';

import products from '@/services/catalog/data/products.json';
import scanGuideData from '@/services/catalog/data/scan-guide.json';

type CatalogProduct = (typeof products)[number];

export type CatalogProductLink = {
  id: string;
  name: string;
  brand: string;
  image: string;
  href: string;
};

const productsById = new Map(products.map((product) => [product.id, product]));

const ScanGuideEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  pattern: z.string().min(1),
  productIds: z.array(z.string()).min(1),
});

const ScanGuideSchema = z
  .array(ScanGuideEntrySchema)
  .nonempty()
  .superRefine((entries, context) => {
    const seenIds = new Set<string>();
    entries.forEach((entry, index) => {
      if (seenIds.has(entry.id)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate scan guide id: ${entry.id}`,
          path: [index, 'id'],
        });
      }
      seenIds.add(entry.id);

      entry.productIds.forEach((productId, productIndex) => {
        if (productsById.has(productId)) return;
        context.addIssue({
          code: 'custom',
          message: `Unknown product id in scan guide entry ${entry.id}: ${productId}`,
          path: [index, 'productIds', productIndex],
        });
      });
    });
  });

export function parseScanGuide(data: unknown) {
  return ScanGuideSchema.parse(data);
}

export const SCAN_GUIDE = parseScanGuide(scanGuideData);

const [firstEntry, ...otherEntries] = SCAN_GUIDE;
export const GUIDE_IDS: [string, ...string[]] = [
  firstEntry.id,
  ...otherEntries.map((entry) => entry.id),
];

function findProduct(productId: string): CatalogProduct {
  const product = productsById.get(productId);
  if (!product) throw new Error(`Unknown product id: ${productId}`);
  return product;
}

function toCatalogProductLink(product: CatalogProduct): CatalogProductLink {
  const query = new URLSearchParams({ sc: product.subcategory, f: product.filter });
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image: product.image,
    href: `/${product.category}?${query.toString()}`,
  };
}

const linksByGuideId = new Map(
  SCAN_GUIDE.map((entry) => [
    entry.id,
    entry.productIds.map((productId) => toCatalogProductLink(findProduct(productId))),
  ]),
);

export function catalogLinksForGuidePattern(guidePatternId: string): CatalogProductLink[] {
  const links = linksByGuideId.get(guidePatternId);
  if (!links) throw new Error(`Unknown scan guide id: ${guidePatternId}`);
  return links;
}

export function renderScanGuidePrompt(): string {
  return SCAN_GUIDE.map((entry) => {
    const productNames = catalogLinksForGuidePattern(entry.id)
      .map((link) => link.name)
      .join('; ');
    return `- ${entry.id}: ${entry.pattern} Productos: ${productNames}.`;
  }).join('\n');
}
