'use client';

import { useState } from 'react';
import { type Product, getBasket, removeFromBasket, submitOrder } from '@/utils/basket';

export default function BasketPage() {
  const [items, setItems] = useState<Product[]>(() =>
    typeof window === 'undefined' ? [] : getBasket(),
  );

  function remove(id: string) {
    removeFromBasket(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function handleOrder() {
    submitOrder(items, (products) => {
      console.log('Hacer pedido', products);
    });
  }

  return (
    <main className="py-8">
      <h2 className="mb-6 text-2xl font-bold">Carrito</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="mb-8 flex flex-col gap-3">
            {items.map((product) => (
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
