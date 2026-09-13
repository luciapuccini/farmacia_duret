'use client';

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/className';
import { Check } from 'lucide-react';
import { type ComponentProps, type JSX, useEffect, useState } from 'react';
import { addToBasket, getBasket, subscribeToBasket, type Product } from '@/utils/basket';

type ProductCardProps = ComponentProps<'article'> & {
  product: Product;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const [isSelected, setIsSelected] = useState<boolean | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const sync = () => setIsSelected(getBasket().some((item) => item.id === product.id));
    sync();
    return subscribeToBasket(sync);
  }, [product.id]);

  function addProduct() {
    if (addToBasket(product) === 'added') {
      setAnnouncement(`Agregaste ${product.name} a tu consulta.`);
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
              'min-h-11 min-w-28 flex-1 transition-colors duration-[var(--motion-fast)] motion-reduce:transition-none',
              isSelected === null && 'invisible',
              isSelected &&
                'border-green-500 bg-green-100 text-green-700 disabled:border-green-500 disabled:bg-green-100 disabled:text-green-700 disabled:opacity-100',
            )}
            onClick={addProduct}
            disabled={isSelected !== false}
            aria-hidden={isSelected === null}
            aria-label={isSelected ? `Agregado ✓: ${product.name}` : `Agregar ${product.name}`}
          >
            {isSelected ? (
              <span className="inline-flex animate-in items-center gap-1 duration-[var(--motion-fast)] fade-in motion-reduce:animate-none">
                Agregado
                <Check aria-hidden="true" />
              </span>
            ) : (
              'Agregar'
            )}
          </Button>
          <span className="sr-only" role="status">
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
