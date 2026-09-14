'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { clsx } from 'clsx';
import { getBasket, subscribeToBasket, type Product } from '@/utils/basket';
import styles from './MobileCatalogInquiryAction.module.scss';

export function MobileCatalogInquiryAction() {
  const [basket, setBasket] = useState<Product[] | null>(null);

  useEffect(() => {
    const sync = () => setBasket(getBasket());
    sync();
    return subscribeToBasket(sync);
  }, []);

  const count = basket?.length ?? 0;

  if (count === 0) return null;

  const actionLabel = count === 5 ? 'Consulta completa' : 'Revisar consulta';

  return (
    <>
      <div className={styles.reserve} aria-hidden="true" />
      <div className={styles.region}>
        <Link
          href="/basket"
          className={clsx(
            styles.action,
            'pointer-events-auto mx-auto flex min-h-16 w-full max-w-lg touch-manipulation items-center gap-3 rounded-xl bg-ink-900 px-4 py-3 shadow-lg transition-[background-color,box-shadow] duration-[var(--motion-fast)] outline-none hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 motion-reduce:transition-none',
          )}
          aria-label={`${actionLabel}. ${count} de 5 productos`}
        >
          <span
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10"
            aria-hidden="true"
          >
            <ShoppingBag className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{actionLabel}</span>
            <span
              key={count}
              className={clsx(styles.count, 'block text-xs text-white/75 tabular-nums')}
            >
              {count} de 5 productos
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
