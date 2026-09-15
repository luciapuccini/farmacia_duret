import { Check, LoaderCircle, Sparkles } from 'lucide-react';

import { ANALYSIS_STEPS } from '../scan-steps';

export function AnalysisProgress({ activeStep }: { activeStep: number }) {
  return (
    <div
      className="py-6 sm:py-8"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Analizando imagen: ${ANALYSIS_STEPS[activeStep].label}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-ink-900">Progreso del análisis</h2>
        <span className="font-mono text-xs text-ink-400 tabular-nums">
          {activeStep + 1} / {ANALYSIS_STEPS.length}
        </span>
      </div>

      <ol className="space-y-1">
        {ANALYSIS_STEPS.map((step, index) => (
          <AnalysisStep
            key={step.label}
            step={step}
            isComplete={index < activeStep}
            isActive={index === activeStep}
          />
        ))}
      </ol>

      <p className="mt-5 flex items-center gap-2 text-xs leading-5 text-ink-400">
        <Sparkles aria-hidden="true" className="size-3.5 shrink-0" />
        La respuesta aparecerá acá cuando esté lista.
      </p>
    </div>
  );
}

function AnalysisStep({
  step,
  isActive,
  isComplete,
}: {
  step: (typeof ANALYSIS_STEPS)[number];
  isActive: boolean;
  isComplete: boolean;
}) {
  const rowState = isActive ? 'bg-bg-blue opacity-100' : isComplete ? 'opacity-100' : 'opacity-45';
  const iconState = isComplete
    ? 'border-green-600 bg-green-600 text-white'
    : isActive
      ? 'border-blue-500 bg-white text-blue-700'
      : 'border-line bg-bg text-ink-400';

  return (
    <li
      className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-[var(--radius-lg)] px-2 py-3 transition-[background-color,opacity] duration-200 motion-reduce:transition-none ${rowState}`}
    >
      <span
        className={`mt-0.5 flex size-7 items-center justify-center rounded-full border ${iconState}`}
      >
        {isComplete ? (
          <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
        ) : isActive ? (
          <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
        ) : (
          <span className="size-1.5 rounded-full bg-current" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink-900">{step.label}</span>
        <span className="mt-0.5 block text-sm leading-5 text-ink-500">{step.detail}</span>
      </span>
    </li>
  );
}
