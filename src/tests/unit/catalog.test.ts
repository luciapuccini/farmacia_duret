import { describe, it, expect } from 'vitest';
import { getProducts } from '@/services/actions/catalog';

describe('getProducts', () => {
  it('returns all products in a category when subcategory and filter are empty', () => {
    const products = getProducts({ category: 'bebes', subcategory: '', filter: '' });

    expect(products.length).toBe(10);
    expect(products.every((product) => product.category === 'bebes')).toBe(true);
  });

  it('returns products filtered by subcategory', () => {
    const products = getProducts({ category: 'bebes', subcategory: 'panales', filter: '' });

    expect(products.length).toBe(6);
    expect(products.every((product) => product.subcategory === 'panales')).toBe(true);
  });

  it('returns products filtered by subcategory and filter', () => {
    const products = getProducts({
      category: 'bebes',
      subcategory: 'panales',
      filter: 'recien-nacido',
    });

    expect(products).toHaveLength(1);
    expect(products[0]?.name).toBe('Pampers Premium Care Recién Nacido x24');
  });

  it('returns no products for a category without inventory', () => {
    const products = getProducts({ category: 'hogar-y-alimentos', subcategory: '', filter: '' });

    expect(products).toHaveLength(0);
  });
});
