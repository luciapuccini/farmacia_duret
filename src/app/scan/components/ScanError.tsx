import { AlertTriangle, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui';

export function ScanError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-[var(--radius-lg)] border border-red-500/20 bg-red-500/5 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-500" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink-900">No pudimos completar el análisis</h2>
          <p className="mt-1 text-sm leading-6 text-ink-700">{message}</p>
          <Button onClick={onRetry} className="mt-4 min-h-11 touch-manipulation px-4">
            <RotateCcw aria-hidden="true" className="size-4" />
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  );
}
