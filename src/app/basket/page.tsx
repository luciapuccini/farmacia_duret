'use client';

import { CheckCircle2, MessageCircle, PackageOpen, Trash2 } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { TextLink } from '@/components/ui';
import PhoneInput from '@/components/ui/phone-input/phone-input';
import { type Product, clearBasket, getBasket, removeFromBasket } from '@/utils/basket';
import { CatalogoOrderSchema } from '@/app/api/whatsapp/catalogo/schema';
import Heading from './components/Heading';

type Status = 'idle' | 'sending' | 'sent';
const FALLBACK_PRODUCT_IMAGE = '/images/products/fallback-product.webp';
const SUBMISSION_ERROR =
  'No pudimos enviar la consulta por WhatsApp. Tu selección y tu teléfono siguen acá.';
const WHATSAPP_URL = 'https://wa.me/5491178942852';

export default function BasketPage() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const isSubmitting = useRef(false);

  useEffect(() => {
    const loadBasket = window.setTimeout(() => setItems(getBasket()), 0);
    return () => window.clearTimeout(loadBasket);
  }, []);

  function remove(id: string) {
    removeFromBasket(id);
    setItems((current) => current?.filter((product) => product.id !== id) ?? []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting.current) return;

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
        document.getElementById('phone')?.focus();
      } else {
        setError(issue?.message ?? 'Datos inválidos.');
      }
      return;
    }

    isSubmitting.current = true;
    setStatus('sending');

    try {
      const response = await fetch('/api/whatsapp/catalogo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const data = (await response.json()) as { ok?: boolean };

      if (!response.ok || !data.ok) throw new Error('Catalog inquiry submission failed.');

      clearBasket();
      setItems([]);
      setStatus('sent');
    } catch {
      setError(SUBMISSION_ERROR);
      setStatus('idle');
    } finally {
      isSubmitting.current = false;
    }
  }

  return (
    <main className="relative py-2 md:py-4">
      <Heading />

      {items === null ? (
        <p role="status" className="min-h-64 text-sm text-ink-500">
          Cargando tu consulta...
        </p>
      ) : status === 'sent' ? (
        <section
          aria-labelledby="sent-inquiry-heading"
          className="relative isolate overflow-hidden rounded-xl border border-green-100 bg-bg-mint px-5 py-10 text-center shadow-md motion-safe:animate-in motion-safe:duration-[var(--motion-base)] motion-safe:fade-in motion-safe:slide-in-from-bottom-2 sm:px-8 sm:py-14"
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
            className="pointer-events-none absolute top-0 right-0 size-5 border-b border-l border-green-100 bg-green-100"
            style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
          />

          <div className="relative mx-auto flex max-w-lg flex-col items-center">
            <span className="grid size-12 place-items-center rounded-lg bg-bg text-green-700 shadow-sm">
              <CheckCircle2 aria-hidden="true" className="size-6" />
            </span>
            <h2
              id="sent-inquiry-heading"
              className="mt-5 text-2xl font-extrabold tracking-tight text-ink-900"
            >
              Consulta enviada.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">
              Farmacia Duret ya te envió un mensaje. Podés continuar la conversación por WhatsApp
              cuando quieras.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-btn-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none sm:w-auto"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Continuar en WhatsApp
            </a>
          </div>
        </section>
      ) : items.length === 0 ? (
        <section
          aria-labelledby="empty-basket-heading"
          className="relative isolate overflow-hidden rounded-xl border border-blue-100 bg-bg-mint px-5 py-10 text-center shadow-md sm:px-8 sm:py-14"
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

          <div className="relative mx-auto flex max-w-lg flex-col items-center">
            <span className="grid size-12 place-items-center rounded-lg bg-bg text-blue-700 shadow-sm">
              <PackageOpen aria-hidden="true" className="size-6" />
            </span>
            <h2
              id="empty-basket-heading"
              className="mt-5 text-2xl font-extrabold tracking-tight text-ink-900"
            >
              Todavía no agregaste productos.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">
              Podés seleccionar hasta 5 productos del catálogo y enviarnos tu consulta por WhatsApp.
            </p>
            <TextLink
              href="/dermocosmetica?sc=rostro&f=anti-edad"
              variant="primary"
              className="mt-6 min-h-11 w-full touch-manipulation sm:w-auto"
            >
              Seguir explorando
            </TextLink>
          </div>
        </section>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit}
          aria-busy={status === 'sending'}
          className="grid items-start gap-6 pb-[calc(9rem+env(safe-area-inset-bottom))] md:pb-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)] lg:gap-8"
        >
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
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setPhoneError('');
                    }}
                    error={phoneError}
                  />
                </div>

                {error && (
                  <p
                    id="desktop-submit-error"
                    role="alert"
                    className="mt-4 hidden text-sm text-red-500 md:block"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  aria-describedby={error ? 'desktop-submit-error' : undefined}
                  className="mt-4 hidden min-h-11 w-full touch-manipulation items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-btn-primary transition-[background-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none md:inline-flex"
                >
                  {status === 'sending' ? 'Enviando consulta…' : 'Enviar consulta por WhatsApp'}
                </button>
              </div>
            </div>
          </aside>

          <div
            role="region"
            aria-label="Acción de consulta"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-blue-100 bg-bg px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
          >
            {error && (
              <p
                id="mobile-submit-error"
                role="alert"
                className="mx-auto mb-2 max-w-lg text-sm text-red-500"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              aria-describedby={error ? 'mobile-submit-error' : undefined}
              className="mx-auto flex min-h-11 w-full max-w-lg touch-manipulation items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-btn-primary transition-[background-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
            >
              {status === 'sending' ? 'Enviando consulta…' : 'Enviar consulta por WhatsApp'}
            </button>
          </div>

          <span role="status" className="sr-only">
            {status === 'sending' ? 'Enviando consulta por WhatsApp.' : ''}
          </span>
        </form>
      )}
    </main>
  );
}
