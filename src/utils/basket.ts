import { z } from 'zod';

const KEY = 'basket_items';

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

export function getBasket(): Product[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return z.array(ProductSchema).parse(raw);
  } catch {
    return [];
  }
}

export function addToBasket(product: Product): boolean {
  const stored = getBasket();
  if (stored.some((p) => p.id === product.id) || stored.length >= 5) return false;
  const validated = ProductSchema.parse(product);
  localStorage.setItem(KEY, JSON.stringify([...stored, validated]));
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('basket:update'));
  return true;
}

export function removeFromBasket(id: string): void {
  const next = getBasket().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('basket:update'));
}

export function clearBasket(): void {
  localStorage.removeItem(KEY);
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('basket:update'));
}

export function submitOrder(items: Product[], onSubmit: (items: Product[]) => void): void {
  onSubmit(items);
}
