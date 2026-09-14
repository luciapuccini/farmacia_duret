import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Heading() {
  return (
    <header className="mb-6 md:mb-8">
      <nav aria-label="Ruta de navegación" className="mb-3 flex items-center gap-1">
        <Link
          href="/dermocosmetica?sc=rostro&f=anti-edad"
          className="rounded-sm text-xs font-bold tracking-widest text-ink-500 uppercase underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Catálogo
        </Link>
        <ChevronRight aria-hidden="true" className="size-3.5 text-ink-400" />
        <span className="text-xs font-bold tracking-widest text-ink-500 uppercase">Carrito</span>
      </nav>
      <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-ink-900 md:text-4xl">
        Revisá tu consulta
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700 md:text-base">
        Confirmá que estos sean los productos sobre los que querés recibir información.
      </p>
    </header>
  );
}
