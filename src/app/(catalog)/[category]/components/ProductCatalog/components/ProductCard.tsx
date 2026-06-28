'use client';

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/className';
import { ComponentProps, JSX } from 'react';
import { addToBasket, type Product } from '@/utils/basket';

type ProductCardProps = ComponentProps<'article'> & {
  product: Product;
};

export function ProductCard({ product, className }: ProductCardProps) {
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
          <Button className="flex-1" onClick={() => addToBasket(product)}>Comprar</Button>
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
