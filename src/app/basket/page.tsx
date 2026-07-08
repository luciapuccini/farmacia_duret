'use client';

import { useState } from 'react';
import PhoneInput from '@/components/ui/phone-input/phone-input';
import { type Product, clearBasket, getBasket, removeFromBasket } from '@/utils/basket';
import { CatalogoOrderSchema } from '@/app/api/whatsapp/catalogo/schema';

type Status = 'idle' | 'sending' | 'sent';

export default function BasketPage() {
  const [items, setItems] = useState<Product[]>(() =>
    typeof window === 'undefined' ? [] : getBasket(),
  );
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  function remove(id: string) {
    removeFromBasket(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSubmit() {
    setError('');
    setPhoneError('');

    const result = CatalogoOrderSchema.safeParse({
      to: phone,
      items: items.map((p) => p.name),
    });

    if (!result.success) {
      const issue = result.error.issues[0];
      if (issue?.path[0] === 'to') {
        setPhoneError(issue.message);
      } else {
        setError(issue?.message ?? 'Datos inválidos.');
      }
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
    <main className="py-8">
      <h2 className="mb-6 text-2xl font-bold">Carrito</h2>

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

          <div className="mb-4 flex flex-col gap-1">
            <PhoneInput
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={phoneError}
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

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
