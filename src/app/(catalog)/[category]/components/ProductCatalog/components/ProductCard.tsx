'use client';

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import { Heart } from 'lucide-react';

type ProductCardProps = ComponentProps<'article'> & {
  name: string;
  category: string;
  image?: string;
  price?: number;
};

const IMG_FALLBACK =
  'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742';

export function ProductCard({ image, name, category, price, className }: ProductCardProps) {
  const src = image ?? IMG_FALLBACK;

  return (
    <Card className={cn('not-prose w-full overflow-hidden', className)}>
      <img src={src} alt={name} className="aspect-3/2 w-full object-cover" />
      <CardHeader>
        <CardTitle className="line-clamp-2 text-sm leading-snug">{name}</CardTitle>
        <CardDescription>{category}</CardDescription>
        <CardAction>
          <Button className="flex-1">Comprar</Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
