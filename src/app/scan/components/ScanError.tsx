import { AlertTriangle } from 'lucide-react';

export function ScanError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-[var(--radius-lg)] border border-red-500/20 bg-red-500/5 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-500" />
        <div>
          <h2 className="text-sm font-semibold text-ink-900">No pudimos completar el análisis</h2>
          <p className="mt-1 text-sm leading-6 text-ink-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
