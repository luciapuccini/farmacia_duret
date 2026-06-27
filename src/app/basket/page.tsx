'use client';

import { useEffect, useState } from 'react';
import products from '@/services/catalog/data/products.json';

type Product = (typeof products)[number];

export default function BasketPage() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const stored: string[] = JSON.parse(localStorage.getItem('basket_items') ?? '[]');
    setItems(stored);
  }, []);

  function remove(id: string) {
    const next = items.filter((i) => i !== id);
    setItems(next);
    localStorage.setItem('basket_items', JSON.stringify(next));
    window.dispatchEvent(new Event('basket:update'));
  }

  function handleOrder() {
    const basketProducts = items.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    console.log('Hacer pedido', basketProducts);
  }

  const basketProducts = items
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <main className="py-8">
      <h2 className="mb-6 text-2xl font-bold">Carrito</h2>

      {basketProducts.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="mb-8 flex flex-col gap-3">
            {basketProducts.map((product) => (
              <li key={product.id} className="flex items-center justify-between border-b pb-3">
                <span className="text-sm">{product.name}</span>
                <button
                  onClick={() => remove(product.id)}
                  className="ml-4 text-sm text-red-600 hover:underline"
                >
                  Borrar
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={handleOrder}
            className="rounded-md bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Hacer pedido
          </button>
        </>
      )}
    </main>
  );
}
