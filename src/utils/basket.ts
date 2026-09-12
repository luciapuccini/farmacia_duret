import { z } from 'zod';

const KEY = 'basket_items';
const UPDATE_EVENT = 'basket:update';
const EMPTY_BASKET: BasketSnapshot = Object.freeze([]);
const subscribers = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedSnapshot: BasketSnapshot = EMPTY_BASKET;

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  image: z.string().nullable(),
  current_offer: z.string().nullable(),
  category: z.string(),
  subcategory: z.string(),
  filter: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
export type BasketSnapshot = readonly Product[];
export type AddToBasketOutcome = 'added' | 'already-selected' | 'limit-reached';

function readStoredValue(): string | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function notifySubscribers(): void {
  subscribers.forEach((subscriber) => subscriber());
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(UPDATE_EVENT));
}

function storeBasket(items: Product[]): void {
  const raw = JSON.stringify(items);
  localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = items;
  notifySubscribers();
}

export function getBasketSnapshot(): BasketSnapshot {
  const raw = readStoredValue();
  if (raw === cachedRaw) return cachedSnapshot;

  cachedRaw = raw;
  if (raw === null) {
    cachedSnapshot = EMPTY_BASKET;
    return cachedSnapshot;
  }

  try {
    const result = z.array(ProductSchema).safeParse(JSON.parse(raw));
    cachedSnapshot = result.success ? result.data : EMPTY_BASKET;
  } catch {
    cachedSnapshot = EMPTY_BASKET;
  }

  return cachedSnapshot;
}

export function getServerBasketSnapshot(): BasketSnapshot {
  return EMPTY_BASKET;
}

export function subscribeToBasket(subscriber: () => void): () => void {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
}

export function getBasket(): Product[] {
  return [...getBasketSnapshot()];
}

export function addToBasket(product: Product): AddToBasketOutcome {
  const validated = ProductSchema.parse(product);
  const stored = getBasketSnapshot();

  if (stored.some((item) => item.id === validated.id)) return 'already-selected';
  if (stored.length >= 5) return 'limit-reached';

  storeBasket([...stored, validated]);
  return 'added';
}

export function removeFromBasket(id: string): void {
  storeBasket(getBasketSnapshot().filter((product) => product.id !== id));
}

export function clearBasket(): void {
  localStorage.removeItem(KEY);
  cachedRaw = null;
  cachedSnapshot = EMPTY_BASKET;
  notifySubscribers();
}

export function submitOrder(items: Product[], onSubmit: (items: Product[]) => void): void {
  onSubmit(items);
}
