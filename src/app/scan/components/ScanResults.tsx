import { AlertTriangle, CircleCheck } from 'lucide-react';

import type { ScanResult } from '../scan.types';

export function ScanResults({ result }: { result: ScanResult }) {
  return (
    <article aria-live="polite" className="py-6 sm:py-8">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-mint text-green-700">
          <CircleCheck aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold text-green-700">Análisis listo</p>
          <h2 className="mt-0.5 text-xl font-semibold tracking-[-0.02em] text-ink-900">
            Lo que observamos
          </h2>
        </div>
      </div>

      <p className="mt-5 text-base leading-7 text-ink-700">{result.summary}</p>

      {result.medicalCheckFirst.suggested && (
        <aside className="mt-6 rounded-[var(--radius-lg)] border border-warn/25 bg-warn/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-700" />
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Antes de elegir un producto</h3>
              <p className="mt-1 text-sm leading-6 text-ink-700">
                {result.medicalCheckFirst.reason ??
                  'Por prudencia, conviene consultar con un profesional antes de iniciar una rutina.'}
              </p>
            </div>
          </div>
        </aside>
      )}

      {result.visiblePatterns.length > 0 && (
        <section className="mt-7 border-t border-line pt-6" aria-labelledby="visible-patterns">
          <h3 id="visible-patterns" className="text-sm font-semibold text-ink-900">
            Patrones visibles
          </h3>
          <ul className="mt-3 space-y-2.5">
            {result.visiblePatterns.map((pattern, index) => (
              <li
                key={`${pattern}-${index}`}
                className="flex items-start gap-3 text-sm leading-6 text-ink-700"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.cosmeticSolutions.length > 0 && (
        <section className="mt-7 border-t border-line pt-6" aria-labelledby="cosmetic-solutions">
          <h3 id="cosmetic-solutions" className="text-sm font-semibold text-ink-900">
            Opciones cosméticas
          </h3>
          <ol className="mt-2 divide-y divide-line">
            {result.cosmeticSolutions.map((solution, index) => (
              <li
                key={`${solution.name}-${index}`}
                className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 py-4"
              >
                <span className="font-mono text-sm text-blue-700 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-ink-900">{solution.name}</h4>
                  <p className="mt-1 text-sm leading-6 text-ink-700">{solution.rationale}</p>
                  <p className="mt-2 text-xs leading-5 text-ink-500">
                    <span className="font-semibold text-ink-700">A tener en cuenta:</span>{' '}
                    {solution.precautions}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}
