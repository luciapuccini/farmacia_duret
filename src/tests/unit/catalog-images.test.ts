import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import products from '@/services/catalog/data/products.json';

const FALLBACK_PRODUCT_IMAGE = '/images/products/fallback-product.webp';

describe('catalog product illustrations', () => {
  it('uses local illustrations for every product and provides the fallback asset', () => {
    expect(products).toHaveLength(20);
    expect(products.every((product) => product.image.startsWith('/images/products/'))).toBe(true);
    expect(products.some((product) => /^https?:\/\//.test(product.image))).toBe(false);

    const missingAssets = [
      ...products.map((product) => product.image),
      FALLBACK_PRODUCT_IMAGE,
    ].filter((image) => !existsSync(resolve(process.cwd(), 'public', image.slice(1))));

    expect(
      missingAssets,
      `Missing local product image files:\n${missingAssets.join('\n')}`,
    ).toEqual([]);
  });
});
