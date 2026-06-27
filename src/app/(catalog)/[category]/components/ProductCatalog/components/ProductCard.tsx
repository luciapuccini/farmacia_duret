'use client';

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/className';
import { ComponentProps, JSX } from 'react';

type ProductCardProps = ComponentProps<'article'> & {
  id: string;
  name: string;
  category: string;
  image?: string;
  price?: number;
};

export function ProductCard({ id, image, name, category, className }: ProductCardProps) {
  function handleAdd() {
    const stored: string[] = JSON.parse(localStorage.getItem('basket_items') ?? '[]');
    if (!stored.includes(id) && stored.length < 5) {
      localStorage.setItem('basket_items', JSON.stringify([...stored, id]));
      window.dispatchEvent(new Event('basket:update'));
    }
  }

  return (
    <Card className={cn('not-prose h-fit w-full overflow-hidden', className)}>
      {image ? (
        <img src={image} alt={name} className="aspect-3/2 w-full object-cover" />
      ) : (
        <EmptyStateImg />
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2 text-sm leading-snug">{name}</CardTitle>
        <CardDescription>{category}</CardDescription>
        <CardAction>
          <Button className="flex-1" onClick={handleAdd}>Comprar</Button>
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
