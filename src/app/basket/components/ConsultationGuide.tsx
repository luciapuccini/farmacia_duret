import PhoneInput from '@/components/ui/phone-input/phone-input';
import type { InquiryStatus } from '../basketInquiry';

const FOLDED_CLIP_PATH = 'polygon(0 0, calc(100% - 1.25rem) 0, 100% 1.25rem, 100% 100%, 0 100%)';

function GuideSteps() {
  return (
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
            Farmacia Duret confirma disponibilidad, precio y detalles de retiro en la conversación.
          </p>
        </div>
      </li>
    </ol>
  );
}

function DesktopSubmit({ error, status }: { error: string; status: InquiryStatus }) {
  return (
    <>
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
    </>
  );
}

type ConsultationGuideProps = {
  itemCount: number;
  phone: string;
  phoneError: string;
  error: string;
  status: InquiryStatus;
  onPhoneChange: (value: string) => void;
};

export default function ConsultationGuide({
  itemCount,
  phone,
  phoneError,
  error,
  status,
  onPhoneChange,
}: ConsultationGuideProps) {
  return (
    <aside
      aria-labelledby="consultation-guide-heading"
      className="relative isolate overflow-hidden rounded-xl border border-blue-100 bg-bg-mint shadow-md lg:sticky lg:top-28"
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
          <p className="shrink-0 text-sm font-bold text-blue-700 tabular-nums">{itemCount} de 5</p>
        </div>

        <GuideSteps />

        <div className="mt-6 border-t border-blue-100 pt-6">
          <div className="flex flex-col gap-1">
            <PhoneInput
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              error={phoneError}
            />
          </div>

          <DesktopSubmit error={error} status={status} />
        </div>
      </div>
    </aside>
  );
}
