'use client';

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/className';
import { Check } from 'lucide-react';
import { type ComponentProps, type JSX, useState, useSyncExternalStore } from 'react';
import {
  addToBasket,
  getBasketSnapshot,
  getServerBasketSnapshot,
  subscribeToBasket,
  type Product,
} from '@/utils/basket';

type ProductCardProps = ComponentProps<'article'> & {
  product: Product;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const basket = useSyncExternalStore(
    subscribeToBasket,
    getBasketSnapshot,
    getServerBasketSnapshot,
  );
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const [announcement, setAnnouncement] = useState('');
  const isSelected = isHydrated && basket.some((item) => item.id === product.id);

  function addProduct() {
    const outcome = addToBasket(product);

    if (outcome === 'added') {
      setAnnouncement(`Agregaste ${product.name} a tu consulta.`);
    } else if (outcome === 'already-selected') {
      setAnnouncement(`${product.name} ya está agregado a tu consulta.`);
    } else {
      setAnnouncement('Podés agregar hasta cinco productos a tu consulta.');
    }
  }

  return (
    <Card className={cn('not-prose h-fit w-full overflow-hidden', className)}>
      {product.image ? (
        <img src={product.image} alt={product.name} className="aspect-3/2 w-full object-cover" />
      ) : (
        <EmptyStateImg />
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2 text-sm leading-snug">{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
        <CardAction>
          <Button
            className={cn(
              'min-h-11 flex-1 overflow-hidden transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] motion-reduce:transition-none',
              !isHydrated &&
                'border-line bg-bg-soft text-ink-500 disabled:bg-bg-soft disabled:opacity-100',
              isSelected &&
                'border-green-500 bg-green-100 text-green-700 disabled:border-green-500 disabled:bg-green-100 disabled:text-green-700 disabled:opacity-100',
            )}
            onClick={addProduct}
            disabled={!isHydrated || isSelected}
            aria-busy={!isHydrated}
            aria-label={
              !isHydrated
                ? `Cargando selección: ${product.name}`
                : isSelected
                  ? `Agregado ✓: ${product.name}`
                  : `Agregar ${product.name}`
            }
          >
            <span className="grid">
              <span
                className={cn(
                  'col-start-1 row-start-1 transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] motion-reduce:transform-none motion-reduce:transition-none',
                  !isHydrated ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
                )}
                aria-hidden={isHydrated}
              >
                Cargando…
              </span>
              <span
                className={cn(
                  'col-start-1 row-start-1 transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] motion-reduce:transform-none motion-reduce:transition-none',
                  isHydrated && !isSelected
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-1 opacity-0',
                )}
                aria-hidden={!isHydrated || isSelected}
              >
                Agregar
              </span>
              <span
                className={cn(
                  'col-start-1 row-start-1 inline-flex items-center justify-center gap-1 transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] motion-reduce:transform-none motion-reduce:transition-none',
                  isSelected ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
                )}
                aria-hidden={!isSelected}
              >
                Agregado
                <Check aria-hidden="true" />
              </span>
            </span>
          </Button>
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {announcement}
          </span>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

const EmptyStateImg = (): JSX.Element => {
  return (
    // NOTE: --card-spacing is inherited css var from shadcn card, not my design tokens
    <div
      className="-mt-(--card-spacing) grid aspect-3/2 h-fit w-full place-items-center overflow-hidden [background:var(--bg-stripe-blue)]"
      role="img"
    />
  );
};

function subscribeToHydration(): () => void {
  return () => undefined;
}

function getClientHydrationSnapshot(): boolean {
  return true;
}

function getServerHydrationSnapshot(): boolean {
  return false;
}
