import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type Product,
  addToBasket,
  clearBasket,
  getBasket,
  removeFromBasket,
  subscribeToBasket,
  submitOrder,
} from '@/utils/basket';

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
    vi.stubGlobal('window', new EventTarget());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('addToBasket', () => {
    it('adds a product to the basket', () => {
      expect(addToBasket(makeProduct({ id: '1' }))).toBe('added');
      expect(getBasket()).toHaveLength(1);
      expect(getBasket()[0].id).toBe('1');
    });

    it('does not add a duplicate product', () => {
      addToBasket(makeProduct({ id: '1' }));
      const stored = localStorage.getItem('basket_items');

      expect(addToBasket(makeProduct({ id: '1' }))).toBe('already-selected');
      expect(getBasket()).toHaveLength(1);
      expect(localStorage.getItem('basket_items')).toBe(stored);
    });

    it('adds the fifth product and rejects a sixth without changing storage', () => {
      ['1', '2', '3', '4'].forEach((id) => addToBasket(makeProduct({ id })));

      expect(getBasket().map((product) => product.id)).toEqual(['1', '2', '3', '4']);
      expect(addToBasket(makeProduct({ id: '5' }))).toBe('added');
      expect(getBasket().map((product) => product.id)).toEqual(['1', '2', '3', '4', '5']);

      const stored = localStorage.getItem('basket_items');

      expect(addToBasket(makeProduct({ id: '6' }))).toBe('limit-reached');
      expect(getBasket()).toHaveLength(5);
      expect(getBasket().map((product) => product.id)).toEqual(['1', '2', '3', '4', '5']);
      expect(localStorage.getItem('basket_items')).toBe(stored);
    });

    it('stores the full product object', () => {
      const product = makeProduct({ id: '2', name: 'Huggies x60', brand: 'Huggies' });
      addToBasket(product);
      expect(getBasket()[0]).toEqual(product);
    });
  });

  describe('getBasket', () => {
    it('returns an empty basket for malformed stored JSON', () => {
      localStorage.setItem('basket_items', '{not-json');

      expect(getBasket()).toEqual([]);
    });

    it('returns an empty basket for schema-invalid stored data', () => {
      localStorage.setItem('basket_items', JSON.stringify([{ id: '1', name: 'Incomplete' }]));

      expect(getBasket()).toEqual([]);
    });

    it('returns an empty basket when browser storage is unavailable', () => {
      vi.unstubAllGlobals();

      expect(getBasket()).toEqual([]);
    });
  });

  describe('subscriptions', () => {
    it('notifies active subscribers after add, remove, and clear mutations', () => {
      const subscriber = vi.fn();
      const unsubscribe = subscribeToBasket(subscriber);

      addToBasket(makeProduct());
      removeFromBasket('1');
      clearBasket();

      expect(subscriber).toHaveBeenCalledTimes(3);

      unsubscribe();
      addToBasket(makeProduct({ id: '2' }));
      expect(subscriber).toHaveBeenCalledTimes(3);
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
