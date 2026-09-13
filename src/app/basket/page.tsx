'use client';

import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PhoneInput from '@/components/ui/phone-input/phone-input';
import { type Product, clearBasket, getBasket, removeFromBasket } from '@/utils/basket';
import { CatalogoOrderSchema } from '@/app/api/whatsapp/catalogo/schema';
import Heading from './components/Heading';

type Status = 'idle' | 'sending' | 'sent';
const FALLBACK_PRODUCT_IMAGE = '/images/products/fallback-product.webp';

export default function BasketPage() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const loadBasket = window.setTimeout(() => setItems(getBasket()), 0);
    return () => window.clearTimeout(loadBasket);
  }, []);

  function remove(id: string) {
    removeFromBasket(id);
    setItems((current) => current?.filter((product) => product.id !== id) ?? []);
  }

  async function handleSubmit() {
    setError('');
    setPhoneError('');

    const result = CatalogoOrderSchema.safeParse({
      to: phone,
      items: items?.map((product) => product.name) ?? [],
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
    <main className="relative py-2 md:py-4">
      <Heading />

      {items === null ? (
        <p role="status" className="min-h-64 text-sm text-ink-500">
          Cargando tu consulta...
        </p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : status === 'sent' ? (
        <p className="text-green-700">¡Pedido enviado! Te contactaremos por WhatsApp.</p>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)] lg:gap-8">
          <section aria-labelledby="selected-products-heading" className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-4">
              <h2 id="selected-products-heading" className="text-lg font-bold text-ink-900">
                Productos seleccionados
              </h2>
              <p
                aria-live="polite"
                className="shrink-0 text-sm font-semibold text-ink-500 tabular-nums"
              >
                {items.length} de 5 productos
              </p>
            </div>

            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg shadow-sm">
              {items.map((product) => (
                <li key={product.id} className="flex min-w-0 gap-3 p-3 sm:gap-4 sm:p-4">
                  <div className="aspect-3/2 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-blue sm:w-28">
                    <img
                      src={product.image ?? FALLBACK_PRODUCT_IMAGE}
                      alt=""
                      width={168}
                      height={112}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-start">
                    <h3 className="text-sm leading-snug font-bold text-ink-900 sm:text-base">
                      {product.name}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-500 sm:text-sm">
                      <span>{product.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{product.subcategory.replaceAll('-', ' ')}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={`Borrar ${product.name} de la consulta`}
                      className="mt-2 inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-red-500 underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:bg-red-500/10 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside
            aria-labelledby="consultation-guide-heading"
            className="relative isolate overflow-hidden rounded-xl border border-blue-100 bg-bg-mint shadow-md lg:sticky lg:top-28"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 1.25rem) 0, 100% 1.25rem, 100% 100%, 0 100%)',
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{ backgroundImage: 'var(--bg-stripe-blue)' }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 size-5 border-b border-l border-blue-100 bg-bg-blue"
              style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
            />

            <div className="relative p-5 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
                    Consulta por WhatsApp
                  </p>
                  <h2
                    id="consultation-guide-heading"
                    className="text-xl font-extrabold tracking-tight text-ink-900"
                  >
                    Cómo sigue
                  </h2>
                </div>
                <p className="shrink-0 text-sm font-bold text-blue-700 tabular-nums">
                  {items.length} de 5
                </p>
              </div>

              <ol className="mt-6 flex flex-col gap-5">
                <li className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-blue-100 text-xs font-extrabold text-blue-700">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">Revisá tu selección</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-700">
                      Si algo no corresponde, podés borrarlo antes de enviar la consulta.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-green-100 text-xs font-extrabold text-green-700">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">Seguimos por WhatsApp</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-700">
                      Farmacia Duret confirma disponibilidad, precio y detalles de retiro en la
                      conversación.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-6 border-t border-blue-100 pt-6">
                <div className="flex flex-col gap-1">
                  <PhoneInput
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    error={phoneError}
                  />
                </div>

                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                  className="mt-4 inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-btn-primary transition-colors duration-[var(--motion-fast)] hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
                >
                  {status === 'sending' ? 'Enviando...' : 'Hacer pedido'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
