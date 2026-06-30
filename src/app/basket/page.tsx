'use client';

import { useState } from 'react';
import { type Product, clearBasket, getBasket, removeFromBasket } from '@/utils/basket';
import { CatalogoOrderSchema } from '@/app/api/whatsapp/catalogo/schema';
import Heading from './components/Heading';

type Status = 'idle' | 'sending' | 'sent';

export default function BasketPage() {
  const [items, setItems] = useState<Product[]>(() =>
    typeof window === 'undefined' ? [] : getBasket(),
  );
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  function remove(id: string) {
    removeFromBasket(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSubmit() {
    setError('');

    const result = CatalogoOrderSchema.safeParse({
      to: phone,
      items: items.map((p) => p.name),
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Datos inválidos.');
      return;
    }

    setStatus('sending');

    const response = await fetch('/api/whatsapp/catalogo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
    });
    const data = await response.json();

    if (data.ok) {
      clearBasket();
      setItems([]);
      setStatus('sent');
    } else {
      setError(data.error ?? 'No pudimos enviar el pedido.');
      setStatus('idle');
    }
  }

  return (
    <main>
      <Heading />

      <div className="mb-4 flex flex-col justify-end gap-1">
        <label htmlFor="phone" className="text-sm font-medium">
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="+54 9 11 ..."
          className="w-full max-w-xs rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {items.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : status === 'sent' ? (
        <p className="text-green-700">¡Pedido enviado! Te contactaremos por WhatsApp.</p>
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
            onClick={handleSubmit}
            disabled={status === 'sending'}
            className="rounded-md bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {status === 'sending' ? 'Enviando...' : 'Hacer pedido'}
          </button>
        </>
      )}
    </main>
  );
}
