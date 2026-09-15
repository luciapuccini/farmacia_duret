import type { InquiryStatus } from '../basketInquiry';

export default function MobileSubmitAction({
  error,
  status,
}: {
  error: string;
  status: InquiryStatus;
}) {
  return (
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
  );
}
