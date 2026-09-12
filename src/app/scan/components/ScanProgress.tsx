import { Check, ImageIcon, ListChecks, LoaderCircle, ScanFace } from 'lucide-react';

import type { ScanPhase } from '@/types/types';
import { cn } from '@/utils/className';
import type { ScanStatus } from './useSkinScan';

const steps = [
  {
    phase: 'preparing',
    title: 'Preparamos la imagen',
    description: 'Enviamos la foto de ejemplo para iniciar el análisis.',
    icon: ImageIcon,
  },
  {
    phase: 'analyzing',
    title: 'Observamos los detalles visibles',
    description: 'La IA analiza la apariencia superficial de la piel en esta foto.',
    icon: ScanFace,
  },
  {
    phase: 'composing',
    title: 'Armamos la orientación',
    description: 'Recibimos las observaciones, las opciones de cuidado y sus precauciones.',
    icon: ListChecks,
  },
] as const;

export const phaseMessages: Record<ScanPhase, string> = {
  preparing: 'Preparando la imagen…',
  analyzing: 'Observando los detalles…',
  composing: 'La orientación está tomando forma…',
};

export default function ScanProgress({ phase, status }: { phase: ScanPhase; status: ScanStatus }) {
  const currentIndex = steps.findIndex((step) => step.phase === phase);

  return (
    <ol aria-label="Pasos del análisis" className="space-y-1">
      {steps.map((step, index) => {
        const done = status === 'success' || (status !== 'idle' && index < currentIndex);
        const active = status === 'running' && index === currentIndex;
        const stopped = (status === 'error' || status === 'cancelled') && index === currentIndex;
        const Icon = done ? Check : active ? LoaderCircle : step.icon;

        return (
          <li
            key={step.phase}
            aria-current={active ? 'step' : undefined}
            className={cn(
              'relative flex gap-3 rounded-2xl p-3 transition-colors motion-reduce:transition-none sm:gap-4',
              active && 'bg-bg-blue',
            )}
          >
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-14 bottom-0 left-[31px] border-l',
                  done ? 'border-green-600/30' : 'border-line',
                )}
              />
            )}
            <span
              className={cn(
                'relative flex size-10 shrink-0 items-center justify-center rounded-full border bg-bg text-ink-500',
                done && 'border-green-600/20 bg-bg-mint text-green-700',
                active && 'border-blue-600/20 text-blue-700',
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn('size-[18px]', active && 'animate-spin motion-reduce:animate-none')}
              />
            </span>
            <div className="min-w-0 flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className={cn('text-sm text-ink-700', active && 'text-blue-700')}>
                  {step.title}
                </h3>
                <span className="text-[11px] font-medium text-ink-500">
                  {done ? 'Listo' : active ? 'En curso' : stopped ? 'Interrumpido' : 'Pendiente'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-500 sm:text-sm">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
