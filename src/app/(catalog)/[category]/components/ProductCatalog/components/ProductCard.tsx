'use client';

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/className';
import { Check } from 'lucide-react';
import { type ComponentProps, useEffect, useId, useState } from 'react';
import { addToBasket, getBasket, subscribeToBasket, type Product } from '@/utils/basket';

const FALLBACK_PRODUCT_IMAGE = '/images/products/fallback-product.webp';

type ProductCardProps = ComponentProps<'article'> & {
  product: Product;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const [basket, setBasket] = useState<Product[] | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [imageSrc, setImageSrc] = useState(product.image ?? FALLBACK_PRODUCT_IMAGE);
  const limitDescriptionId = useId();

  useEffect(() => {
    const sync = () => setBasket(getBasket());
    sync();
    return subscribeToBasket(sync);
  }, []);

  const isSelected = basket?.some((item) => item.id === product.id) ?? null;
  const isAtLimit = basket !== null && basket.length >= 5 && !isSelected;

  function addProduct() {
    const outcome = addToBasket(product);

    if (outcome === 'added') {
      setAnnouncement(
        getBasket().length === 5
          ? `Agregaste ${product.name} a tu consulta. Consulta completa: 5 de 5 productos.`
          : `Agregaste ${product.name} a tu consulta.`,
      );
    } else if (outcome === 'limit-reached') {
      setBasket(getBasket());
      setAnnouncement(
        'Alcanzaste el máximo de 5 productos. Quitá uno de tu consulta para seleccionar otro.',
      );
    }
  }

  return (
    <Card className={cn('not-prose h-fit w-full overflow-hidden', className)}>
      <img
        src={imageSrc}
        alt={product.name}
        width={960}
        height={640}
        className="aspect-3/2 w-full object-cover"
        onError={() => setImageSrc(FALLBACK_PRODUCT_IMAGE)}
      />
      <CardHeader>
        <CardTitle className="line-clamp-2 text-sm leading-snug">{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
        <CardAction>
          <Button
            className={cn(
              'min-h-11 min-w-28 flex-1 transition-colors duration-[var(--motion-fast)] motion-reduce:transition-none',
              isSelected === null && 'invisible',
              isSelected && 'border-green-500 bg-green-100 text-green-700 disabled:opacity-100',
              isAtLimit && 'border-ink-300 bg-bg-soft text-ink-700 disabled:opacity-100',
            )}
            onClick={addProduct}
            disabled={isSelected !== false || isAtLimit}
            aria-hidden={isSelected === null}
            aria-label={
              isSelected
                ? `Agregado ✓: ${product.name}`
                : isAtLimit
                  ? `Máximo alcanzado: ${product.name}`
                  : `Agregar ${product.name}`
            }
            aria-describedby={isAtLimit ? limitDescriptionId : undefined}
          >
            {isSelected ? (
              <span className="inline-flex animate-in items-center gap-1 duration-[var(--motion-fast)] fade-in motion-reduce:animate-none">
                Agregado
                <Check aria-hidden="true" />
              </span>
            ) : isAtLimit ? (
              'Máximo alcanzado'
            ) : (
              'Agregar'
            )}
          </Button>
          {isAtLimit && (
            <span id={limitDescriptionId} className="sr-only">
              Quitá un producto de tu consulta para seleccionar otro.
            </span>
          )}
          <span className="sr-only" role="status">
            {announcement}
          </span>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
