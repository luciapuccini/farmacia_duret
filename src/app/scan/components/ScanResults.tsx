import { AlertTriangle, CircleCheck, LoaderCircle } from 'lucide-react';

import type { CosmeticSolution, ScanResult } from '../scan.schema';

export type ScanItems = {
  summary: string | null;
  medicalCheck: ScanResult['medicalCheckFirst'] | null;
  patterns: string[];
  solutions: CosmeticSolution[];
};

export const EMPTY_SCAN_ITEMS: ScanItems = {
  summary: null,
  medicalCheck: null,
  patterns: [],
  solutions: [],
};

// Each item fades in when it arrives. With reduced motion, it appears with no animation.
const REVEAL = 'animate-fade-in motion-reduce:animate-none';

export function ScanResults({ items, isStreaming }: { items: ScanItems; isStreaming: boolean }) {
  return (
    <>
      {/* One polite announcement at done. The items do not interrupt the screen reader. */}
      <p role="status" className="sr-only">
        {isStreaming ? '' : 'Análisis listo'}
      </p>
      <article aria-label="Resultado del análisis" aria-busy={isStreaming} className="py-6 sm:py-8">
        {isStreaming ? <WaitingHeader /> : <ReadyHeader />}

        {items.summary ? (
          <p className={`mt-5 text-base leading-7 text-ink-700 ${REVEAL}`}>{items.summary}</p>
        ) : (
          isStreaming && <SummarySkeleton />
        )}

        {items.medicalCheck?.suggested && (
          <aside
            className={`mt-6 rounded-[var(--radius-lg)] border border-warn/25 bg-warn/10 p-4 ${REVEAL}`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-700" />
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Antes de elegir un producto</h3>
                <p className="mt-1 text-sm leading-6 text-ink-700">
                  {items.medicalCheck.reason ??
                    'Por prudencia, conviene consultar con un profesional antes de iniciar una rutina.'}
                </p>
              </div>
            </div>
          </aside>
        )}

        <PatternList patterns={items.patterns} />
        <SolutionList solutions={items.solutions} />

        {isStreaming && items.summary && (
          <p className="mt-6 flex items-center gap-2 text-sm text-ink-500">
            <LoaderCircle
              aria-hidden="true"
              className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
            />
            Preparando más sugerencias…
          </p>
        )}
      </article>
    </>
  );
}

function WaitingHeader() {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-blue text-blue-700">
        <LoaderCircle
          aria-hidden="true"
          className="size-5 animate-spin motion-reduce:animate-none"
        />
      </span>
      <div>
        <p className="text-xs font-semibold text-blue-700">Analizando tu foto…</p>
        <h2 className="mt-0.5 text-xl font-semibold tracking-[-0.02em] text-ink-900">
          Estamos mirando tu foto
        </h2>
      </div>
    </div>
  );
}

function ReadyHeader() {
  return (
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
  );
}

/** Keeps the summary space while the model works, and fills the silent period before it. */
function SummarySkeleton() {
  return (
    <div className="mt-5">
      <div aria-hidden="true" className="space-y-2.5 motion-safe:animate-pulse">
        <div className="h-4 w-full rounded-full bg-line" />
        <div className="h-4 w-11/12 rounded-full bg-line" />
        <div className="h-4 w-2/3 rounded-full bg-line" />
      </div>
      <div className="mt-6 rounded-[var(--radius-lg)] bg-bg-mint p-4">
        <p className="text-sm font-semibold text-ink-900">Mientras tanto</p>
        <p className="mt-1 text-sm leading-6 text-ink-700">
          Una foto puede mostrar patrones, pero no confirmar causas.
        </p>
      </div>
    </div>
  );
}

function PatternList({ patterns }: { patterns: string[] }) {
  if (patterns.length === 0) return null;

  return (
    <section
      className={`mt-7 border-t border-line pt-6 ${REVEAL}`}
      aria-labelledby="visible-patterns"
    >
      <h3 id="visible-patterns" className="text-sm font-semibold text-ink-900">
        Patrones visibles
      </h3>
      <ul className="mt-3 space-y-2.5">
        {patterns.map((pattern, index) => (
          <li
            key={`${pattern}-${index}`}
            className={`flex items-start gap-3 text-sm leading-6 text-ink-700 ${REVEAL}`}
          >
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>{pattern}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SolutionList({ solutions }: { solutions: CosmeticSolution[] }) {
  if (solutions.length === 0) return null;

  return (
    <section
      className={`mt-7 border-t border-line pt-6 ${REVEAL}`}
      aria-labelledby="cosmetic-solutions"
    >
      <h3 id="cosmetic-solutions" className="text-sm font-semibold text-ink-900">
        Opciones cosméticas
      </h3>
      <ol className="mt-2 divide-y divide-line">
        {solutions.map((solution, index) => (
          <li
            key={`${solution.name}-${index}`}
            className={`grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 py-4 ${REVEAL}`}
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
  );
}
