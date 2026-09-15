import { CheckCircle2, MessageCircle, PackageOpen } from 'lucide-react';
import { TextLink } from '@/components/ui';

const WHATSAPP_URL = 'https://wa.me/5491178942852';
const FOLDED_CLIP_PATH = 'polygon(0 0, calc(100% - 1.25rem) 0, 100% 1.25rem, 100% 100%, 0 100%)';

export function LoadingBasket() {
  return (
    <p role="status" className="min-h-64 text-sm text-ink-500">
      Cargando tu consulta...
    </p>
  );
}

export function SentInquiry() {
  return (
    <section
      aria-labelledby="sent-inquiry-heading"
      className="relative isolate overflow-hidden rounded-xl border border-green-100 bg-bg-mint px-5 py-10 text-center shadow-md motion-safe:animate-in motion-safe:duration-[var(--motion-base)] motion-safe:fade-in motion-safe:slide-in-from-bottom-2 sm:px-8 sm:py-14"
      style={{ clipPath: FOLDED_CLIP_PATH }}
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
          Farmacia Duret ya te envió un mensaje. Podés continuar la conversación por WhatsApp cuando
          quieras.
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
  );
}

export function EmptyBasket() {
  return (
    <section
      aria-labelledby="empty-basket-heading"
      className="relative isolate overflow-hidden rounded-xl border border-blue-100 bg-bg-mint px-5 py-10 text-center shadow-md sm:px-8 sm:py-14"
      style={{ clipPath: FOLDED_CLIP_PATH }}
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
  );
}
