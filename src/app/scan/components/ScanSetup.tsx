import { Camera, ImagePlus, LoaderCircle, ScanLine, Sparkles } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui';

import type { ScanStatus } from '../ScanFlow';

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
        Una foto, una guía para tu piel
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-ink-500">
        Analizamos lo que se ve en la foto y proponemos una rutina simple, sin diagnósticos.
      </p>
    </header>
  );
}

export function PhotoPicker({
  previewUrl,
  isCompact,
  errorMessage,
  onPick,
}: {
  previewUrl: string | null;
  /** After "Analizar": on mobile, the photo becomes a small thumbnail above the results. */
  isCompact: boolean;
  errorMessage: string;
  onPick: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.click();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const pickedFile = event.target.files?.[0];
    // Reset the input, so that the same file can be picked again.
    event.target.value = '';
    if (pickedFile) onPick(pickedFile);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="Elegir una foto"
        aria-describedby={errorMessage ? 'photo-error' : undefined}
        className="sr-only"
        tabIndex={-1}
        onChange={handleChange}
      />

      {previewUrl && isCompact && (
        <PhotoThumbnail previewUrl={previewUrl} onChange={openPicker} className="lg:hidden" />
      )}
      {previewUrl && (
        <PhotoPreview
          previewUrl={previewUrl}
          onChange={openPicker}
          className={isCompact ? 'hidden lg:block' : undefined}
        />
      )}
      {!previewUrl && <EmptyPicker onPick={openPicker} />}

      {errorMessage && (
        <p id="photo-error" role="alert" className="mt-3 text-sm leading-6 text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function EmptyPicker({ onPick }: { onPick: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onPick}
        className="flex aspect-square w-full touch-manipulation flex-col items-center justify-center gap-3 rounded-[var(--radius-xl)] border-2 border-dashed border-line bg-bg-soft px-6 text-center text-ink-700 transition-colors hover:border-blue-500 focus-visible:border-blue-500 motion-reduce:transition-none lg:aspect-[4/5]"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-bg-mint text-green-700">
          <Camera aria-hidden="true" className="size-6" />
        </span>
        <span className="text-base font-semibold text-ink-900">Sacá o elegí una foto</span>
        <span className="text-sm leading-6 text-ink-500">JPG, PNG o WEBP, hasta 10 MB</span>
      </button>
      <p className="mt-2.5 text-center text-sm text-ink-500">
        Luz natural · de frente · sin maquillaje
      </p>
    </>
  );
}

function PhotoPreview({
  previewUrl,
  onChange,
  className,
}: {
  previewUrl: string;
  onChange: () => void;
  className?: string;
}) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[var(--radius-xl)] bg-bg-soft shadow-[var(--shadow)] ${className ?? ''}`}
    >
      {/* A local object URL: next/image cannot optimize it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt="Foto seleccionada"
        className="aspect-square w-full object-cover select-none lg:aspect-[4/5]"
        draggable={false}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset"
      />
      <Button
        variant="secondary"
        onClick={onChange}
        className="absolute right-3 bottom-3 min-h-11 touch-manipulation px-4"
      >
        <ImagePlus aria-hidden="true" className="size-4" />
        Cambiar foto
      </Button>
    </figure>
  );
}

function PhotoThumbnail({
  previewUrl,
  onChange,
  className,
}: {
  previewUrl: string;
  onChange: () => void;
  className?: string;
}) {
  return (
    <figure className={`flex items-center gap-4 ${className ?? ''}`}>
      {/* A local object URL: next/image cannot optimize it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt="Foto seleccionada"
        className="size-20 shrink-0 rounded-[var(--radius-lg)] object-cover shadow-[var(--shadow)] ring-1 ring-black/10 select-none"
        draggable={false}
      />
      <figcaption className="min-w-0 flex-1 text-sm text-ink-500">Tu foto</figcaption>
      <Button
        variant="secondary"
        onClick={onChange}
        className="min-h-11 shrink-0 touch-manipulation px-4"
      >
        <ImagePlus aria-hidden="true" className="size-4" />
        Cambiar foto
      </Button>
    </figure>
  );
}

export function ScanAction({ status, onAnalyze }: { status: ScanStatus; onAnalyze: () => void }) {
  const isStreaming = status === 'streaming';

  return (
    <div className="border-b border-line pb-5">
      <Button
        onClick={onAnalyze}
        disabled={isStreaming}
        aria-describedby="scan-consent"
        className="min-h-12 w-full touch-manipulation px-5 sm:w-auto"
      >
        {isStreaming ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <ScanLine aria-hidden="true" className="size-4" />
        )}
        {isStreaming ? 'Analizando…' : 'Analizar'}
      </Button>
      <p id="scan-consent" className="mt-2.5 text-sm leading-6 text-ink-500">
        Al tocar Analizar, tu foto se envía para analizarla y no se guarda.
      </p>
    </div>
  );
}
