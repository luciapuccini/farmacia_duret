import { Check, LoaderCircle, ScanLine, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui';

import type { ScanStatus } from '../scan.types';
import demoImage from '../young-man-portrait.jpg';

export function ScanIntro() {
  return (
    <header className="mb-6 max-w-2xl sm:mb-8">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
        <Sparkles aria-hidden="true" className="size-4" strokeWidth={2} />
        Orientación cosmética con IA
      </p>
      <h1
        id="scan-title"
        className="max-w-xl text-3xl font-semibold tracking-[-0.035em] text-balance text-ink-900 sm:text-4xl"
      >
        Una primera mirada para cuidar tu piel
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-ink-500">
        Analizamos lo que se ve en la foto y proponemos una rutina simple, sin diagnósticos.
      </p>
    </header>
  );
}

export function DemoImage() {
  return (
    <figure className="relative overflow-hidden rounded-[var(--radius-xl)] bg-bg-soft shadow-[var(--shadow)]">
      <Image
        src={demoImage}
        alt="Retrato de demostración utilizado para el análisis cosmético de piel"
        className="aspect-[4/5] w-full object-cover object-[center_32%] select-none"
        sizes="(max-width: 1023px) calc(100vw - 32px), 400px"
        placeholder="blur"
        priority
        draggable={false}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset"
      />
      <figcaption className="absolute top-3 left-3 flex items-center gap-2 rounded-[var(--radius-chip)] border border-white/70 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-ink-700 shadow-sm backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-green-600" />
        Foto de demo
      </figcaption>
    </figure>
  );
}

export function ScanAction({ status, onScan }: { status: ScanStatus; onScan: () => void }) {
  return (
    <div className="border-b border-line pb-5">
      <Button
        onClick={onScan}
        disabled={status === 'loading'}
        aria-describedby="scan-helper"
        className="min-h-12 w-full touch-manipulation px-5 sm:w-auto"
      >
        {status === 'loading' ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <ScanLine aria-hidden="true" className="size-4" />
        )}
        {status === 'loading'
          ? 'Analizando imagen…'
          : status === 'error'
            ? 'Reintentar análisis'
            : 'Analizar imagen'}
      </Button>
      <p id="scan-helper" className="mt-2.5 text-sm leading-6 text-ink-500">
        La foto se usa solo para esta demostración. El análisis puede tardar unos segundos.
      </p>
    </div>
  );
}

export function IdleOverview() {
  const items = [
    'Un resumen de los patrones visibles.',
    'Sugerencias cosméticas simples y sus cuidados.',
    'Una indicación clara si conviene consultar a un profesional.',
  ];

  return (
    <div className="py-7 sm:py-9">
      <h2 className="text-base font-semibold text-ink-900">Qué vas a recibir</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-700">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-bg-mint text-green-700">
              <Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
