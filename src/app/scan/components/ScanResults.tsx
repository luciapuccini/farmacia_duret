'use client';

import { useEffect, useRef } from 'react';
import { Check, HeartHandshake, Leaf, Sparkles } from 'lucide-react';

import type { SkinScanResult } from '@/types/types';

export default function ScanResults({ result }: { result: SkinScanResult }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  return (
    <section aria-labelledby="scan-results-title" className="mt-8 space-y-5">
      <div className="rounded-3xl border border-green-600/20 bg-bg-mint p-6 sm:p-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-green-700 uppercase">
          <Check className="size-4" aria-hidden="true" /> Análisis completo
        </p>
        <h2 ref={heading} tabIndex={-1} id="scan-results-title" className="text-2xl outline-none">
          Una primera orientación
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-700">{result.summary}</p>
      </div>

      {result.medicalCheckFirst.suggested && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <HeartHandshake className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-sm">Antes de elegir un cuidado, consultá con un profesional</h3>
            <p className="mt-1 text-sm leading-relaxed">
              {result.medicalCheckFirst.reason ||
                'Esta foto no alcanza para ofrecerte una orientación cosmética adecuada.'}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-3xl border bg-bg p-6 sm:p-8">
        <h3 className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-blue-600" aria-hidden="true" /> Lo que se observa
        </h3>
        {result.visiblePatterns.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.visiblePatterns.map((pattern, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-xl bg-bg-soft p-4 text-sm leading-relaxed text-ink-700"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
                {pattern}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-ink-500">
            No se pudieron distinguir detalles suficientes en esta imagen.
          </p>
        )}
      </div>

      {!result.medicalCheckFirst.suggested && result.cosmeticSolutions.length > 0 && (
        <div className="rounded-3xl border bg-bg p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-lg">
            <Leaf className="size-5 text-green-700" aria-hidden="true" /> Opciones para cuidar la
            piel
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {result.cosmeticSolutions.map((solution, index) => (
              <article key={index} className="rounded-2xl border p-5">
                <h4 className="text-sm">{solution.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{solution.rationale}</p>
                <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-ink-500">
                  <span className="font-semibold">A tener en cuenta: </span>
                  {solution.precautions}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
      <p className="px-2 text-xs leading-relaxed text-ink-500">{result.disclaimer}</p>
    </section>
  );
}
