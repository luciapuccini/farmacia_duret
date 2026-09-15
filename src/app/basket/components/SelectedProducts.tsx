/* eslint-disable @next/next/no-img-element -- Keep the basket's raw local image URLs unchanged. */

import { Trash2 } from 'lucide-react';
import type { Product } from '@/utils/basket';

const FALLBACK_PRODUCT_IMAGE = '/images/products/fallback-product.webp';

function ProductRow({ product, onRemove }: { product: Product; onRemove: (id: string) => void }) {
  return (
    <li className="flex min-w-0 gap-3 p-3 sm:gap-4 sm:p-4">
      <div className="aspect-3/2 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-blue sm:w-28">
        <img
          src={product.image ?? FALLBACK_PRODUCT_IMAGE}
          alt=""
          width={168}
          height={112}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start">
        <h3 className="text-sm leading-snug font-bold text-ink-900 sm:text-base">{product.name}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-500 sm:text-sm">
          <span>{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{product.subcategory.replaceAll('-', ' ')}</span>
        </p>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Borrar ${product.name} de la consulta`}
          className="mt-2 inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-red-500 underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:bg-red-500/10 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Borrar
        </button>
      </div>
    </li>
  );
}

export default function SelectedProducts({
  items,
  onRemove,
}: {
  items: Product[];
  onRemove: (id: string) => void;
}) {
  return (
    <section aria-labelledby="selected-products-heading" className="min-w-0">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 id="selected-products-heading" className="text-lg font-bold text-ink-900">
          Productos seleccionados
        </h2>
        <p aria-live="polite" className="shrink-0 text-sm font-semibold text-ink-500 tabular-nums">
          {items.length} de 5 productos
        </p>
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg shadow-sm">
        {items.map((product) => (
          <ProductRow key={product.id} product={product} onRemove={onRemove} />
        ))}
      </ul>
    </section>
  );
}
