'use client';

import Image from 'next/image';
import { ArrowRight, Check, Clock3, Info, RotateCcw, ScanFace, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/className';
import portrait from '../young-man-portrait.jpg';
import ScanProgress, { phaseMessages } from './ScanProgress';
import ScanResults from './ScanResults';
import { useSkinScan } from './useSkinScan';

export default function ScanExperience() {
  const { status, phase, result, error, elapsed, startScan, cancelScan } = useSkinScan();
  const running = status === 'running';
  const success = status === 'success';
  const statusMessage = running
    ? phaseMessages[phase]
    : success
      ? 'Tu orientación está lista'
      : status === 'cancelled'
        ? 'Análisis cancelado'
        : status === 'error'
          ? 'No pudimos terminar esta vez'
          : 'Un poco de ayuda para empezar';

  return (
    <>
      <header className="mb-8 max-w-2xl sm:mb-10">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-bg-blue px-3 py-1.5 text-xs font-medium text-blue-700">
          <Sparkles className="size-3.5" aria-hidden="true" /> Cuidado de la piel con IA
        </p>
        <h1 className="text-3xl leading-tight tracking-tight text-ink-900 sm:text-[42px]">
          Una mirada a tu piel.
          <span className="block text-blue-700">Un primer paso para cuidarla.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-ink-500 sm:text-base">
          A partir de una foto, te ayudamos a conocer lo que se ve y a explorar opciones de cuidado
          cosmético.
        </p>
      </header>

      <section
        aria-label="Análisis de la imagen"
        className="overflow-hidden rounded-3xl border bg-bg shadow-sm"
      >
        <div className="grid md:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b bg-bg-soft p-5 sm:p-6 md:border-r md:border-b-0">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-sm text-ink-700">Imagen de ejemplo</h2>
              <span className="rounded-full border bg-bg px-2.5 py-1 text-[10px] font-semibold tracking-wider text-ink-500 uppercase">
                Demo
              </span>
            </div>
            <div className="relative mx-auto max-w-40 overflow-hidden rounded-2xl bg-slate-200 md:max-w-none">
              <Image
                src={portrait}
                alt="Retrato de ejemplo para el análisis cosmético de la piel"
                sizes="(max-width: 767px) 160px, 360px"
                priority
                className="aspect-[4/5] w-full object-cover"
              />
              {running && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border-2 border-white/50 bg-blue-500/10 motion-safe:animate-pulse"
                >
                  <div className="absolute inset-5 rounded-[40%] border border-white/60" />
                </div>
              )}
              <div className="absolute right-3 bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2.5 text-xs text-ink-700 shadow-sm backdrop-blur">
                {success ? (
                  <Check className="size-4 text-green-700" aria-hidden="true" />
                ) : (
                  <ScanFace className="size-4 text-blue-700" aria-hidden="true" />
                )}
                {running
                  ? 'Análisis en curso'
                  : success
                    ? 'Imagen analizada'
                    : 'Lista para analizar'}
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-ink-500">
              Esta prueba usa una foto de ejemplo.
            </p>
          </div>

          <div className="flex min-w-0 flex-col p-5 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-ink-500 uppercase">
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-1.5 rounded-full bg-ink-300',
                    running && 'bg-blue-600',
                    success && 'bg-green-600',
                  )}
                />
                {running ? 'En curso' : success ? 'Completado' : 'Paso a paso'}
              </p>
              {status !== 'idle' && (
                <span
                  className="flex items-center gap-1.5 text-xs text-ink-500"
                  aria-label={`${elapsed} segundos transcurridos`}
                >
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  <span className="font-mono tabular-nums">{elapsed} s</span>
                </span>
              )}
            </div>

            <div role="status" aria-live="polite" aria-atomic="true" className="mb-5">
              <h2 className="text-xl leading-snug tracking-tight">{statusMessage}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {running
                  ? 'Te mostramos cada paso mientras se completa.'
                  : success
                    ? 'Más abajo encontrás las observaciones y los próximos pasos.'
                    : status === 'cancelled'
                      ? 'Podés volver a empezar cuando quieras.'
                      : status === 'error'
                        ? 'Podés iniciar un nuevo análisis con la misma imagen.'
                        : 'Así vamos a acompañarte durante el análisis.'}
              </p>
            </div>

            <ScanProgress phase={phase} status={status} />

            <div className="mt-auto pt-5">
              {running && elapsed >= 25 && (
                <p
                  role="status"
                  className="mb-4 rounded-xl bg-bg-soft p-3 text-xs leading-relaxed text-ink-700"
                >
                  Está llevando un poquito más de tiempo. Podés seguir esperando o cancelar y volver
                  a intentarlo.
                </p>
              )}
              {error && (
                <p role="alert" className="mb-4 text-sm text-red-700">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={startScan}
                  disabled={running}
                  size="lg"
                  className="h-11 flex-1 rounded-xl px-5"
                >
                  {status === 'idle' ? (
                    <ScanFace aria-hidden="true" />
                  ) : (
                    <RotateCcw aria-hidden="true" />
                  )}
                  {running
                    ? 'Analizando imagen'
                    : status === 'idle'
                      ? 'Analizar imagen'
                      : success
                        ? 'Volver a analizar'
                        : 'Reintentar análisis'}
                  {status === 'idle' && <ArrowRight aria-hidden="true" />}
                </Button>
                {running && (
                  <Button
                    onClick={cancelScan}
                    variant="outline"
                    className="h-11 w-full rounded-xl px-4 sm:w-auto"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 border-t bg-bg-soft px-5 py-4 text-xs leading-relaxed text-ink-500 sm:px-6">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
          <p>
            Una foto tiene sus límites. Esta orientación cosmética no reemplaza una evaluación
            profesional.
          </p>
        </div>
      </section>

      {success && result && <ScanResults result={result} />}
    </>
  );
}
