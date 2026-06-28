import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Product, addToBasket, getBasket, removeFromBasket, submitOrder } from '@/utils/basket';

function makeLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      const { [key]: _, ...rest } = store;
      store = rest;
    },
    clear: () => {
      store = {};
    },
  };
}

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    name: 'Pampers Premium Care x24',
    brand: 'Pampers',
    image: null,
    current_offer: null,
    category: 'bebes',
    subcategory: 'panales',
    filter: 'recien-nacido',
    ...overrides,
  };
}

describe('basket', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', makeLocalStorageMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('addToBasket', () => {
    it('adds a product to the basket', () => {
      addToBasket(makeProduct({ id: '1' }));
      expect(getBasket()).toHaveLength(1);
      expect(getBasket()[0].id).toBe('1');
    });

    it('does not add a duplicate product', () => {
      addToBasket(makeProduct({ id: '1' }));
      addToBasket(makeProduct({ id: '1' }));
      expect(getBasket()).toHaveLength(1);
    });

    it('enforces a max of 5 items', () => {
      ['1', '2', '3', '4', '5'].forEach((id) => addToBasket(makeProduct({ id })));
      addToBasket(makeProduct({ id: '6' }));
      expect(getBasket()).toHaveLength(5);
      expect(getBasket().map((p) => p.id)).not.toContain('6');
    });

    it('stores the full product object', () => {
      const product = makeProduct({ id: '2', name: 'Huggies x60', brand: 'Huggies' });
      addToBasket(product);
      expect(getBasket()[0]).toEqual(product);
    });
  });

  describe('removeFromBasket', () => {
    it('removes the product from the basket', () => {
      addToBasket(makeProduct({ id: '1' }));
      addToBasket(makeProduct({ id: '2' }));
      removeFromBasket('1');
      expect(getBasket().map((p) => p.id)).toEqual(['2']);
    });

    it('is a no-op if the product is not in the basket', () => {
      addToBasket(makeProduct({ id: '1' }));
      removeFromBasket('99');
      expect(getBasket()).toHaveLength(1);
    });
  });

  describe('submitOrder', () => {
    it('calls the handler with the current basket products', () => {
      const p1 = makeProduct({ id: '1' });
      const p2 = makeProduct({ id: '2' });
      addToBasket(p1);
      addToBasket(p2);
      const handleSubmit = vi.fn();
      submitOrder(getBasket(), handleSubmit);
      expect(handleSubmit).toHaveBeenCalledOnce();
      expect(handleSubmit).toHaveBeenCalledWith([p1, p2]);
    });
  });
});
