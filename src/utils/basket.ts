import { z } from 'zod';

const KEY = 'basket_items';
const UPDATE_EVENT = 'basket:update';

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
export type AddToBasketOutcome = 'added' | 'already-selected' | 'limit-reached';

function storeBasket(items: Product[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function subscribeToBasket(listener: EventListener): () => void {
  window.addEventListener(UPDATE_EVENT, listener);
  return () => window.removeEventListener(UPDATE_EVENT, listener);
}

export function getBasket(): Product[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    return z.array(ProductSchema).parse(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
  } catch {
    return [];
  }
}

export function addToBasket(product: Product): AddToBasketOutcome {
  const validated = ProductSchema.parse(product);
  const stored = getBasket();

  if (stored.some((item) => item.id === validated.id)) return 'already-selected';
  if (stored.length >= 5) return 'limit-reached';

  storeBasket([...stored, validated]);
  return 'added';
}

export function removeFromBasket(id: string): void {
  storeBasket(getBasket().filter((product) => product.id !== id));
}

export function clearBasket(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function submitOrder(items: Product[], onSubmit: (items: Product[]) => void): void {
  onSubmit(items);
}
