'use client';

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/className';
import { Check } from 'lucide-react';
import { type ComponentProps, useEffect, useId, useState } from 'react';
import {
  type AddToBasketOutcome,
  addToBasket,
  getBasket,
  subscribeToBasket,
  type Product,
} from '@/utils/basket';

const FALLBACK_PRODUCT_IMAGE = '/images/products/fallback-product.webp';

type ProductCardProps = ComponentProps<'article'> & {
  product: Product;
};

type SelectionState = 'loading' | 'selected' | 'limited' | 'available';

function getSelectionState(basket: Product[] | null, productId: string): SelectionState {
  if (basket === null) return 'loading';
  if (basket.some((item) => item.id === productId)) return 'selected';
  if (basket.length >= 5) return 'limited';
  return 'available';
}

function getAnnouncement(outcome: AddToBasketOutcome, productName: string): string {
  if (outcome === 'added') {
    return getBasket().length === 5
      ? `Agregaste ${productName} a tu consulta. Consulta completa: 5 de 5 productos.`
      : `Agregaste ${productName} a tu consulta.`;
  }
  if (outcome === 'limit-reached') {
    return 'Alcanzaste el máximo de 5 productos. Quitá uno de tu consulta para seleccionar otro.';
  }
  return '';
}

function actionLabel(state: SelectionState, productName: string): string {
  if (state === 'selected') return `Agregado ✓: ${productName}`;
  if (state === 'limited') return `Máximo alcanzado: ${productName}`;
  return `Agregar ${productName}`;
}

function ActionContent({ state }: { state: SelectionState }) {
  if (state === 'selected') {
    return (
      <span className="inline-flex animate-in items-center gap-1 duration-[var(--motion-fast)] fade-in motion-reduce:animate-none">
        Agregado
        <Check aria-hidden="true" />
      </span>
    );
  }
  if (state === 'limited') return 'Máximo alcanzado';
  return 'Agregar';
}

function ProductAction({
  state,
  productName,
  limitDescriptionId,
  announcement,
  onAdd,
}: {
  state: SelectionState;
  productName: string;
  limitDescriptionId: string;
  announcement: string;
  onAdd: () => void;
}) {
  return (
    <CardAction>
      <Button
        className={cn(
          'min-h-11 min-w-28 flex-1 transition-colors duration-[var(--motion-fast)] motion-reduce:transition-none',
          state === 'loading' && 'invisible',
          state === 'selected' &&
            'border-green-500 bg-green-100 text-green-700 disabled:opacity-100',
          state === 'limited' && 'border-ink-300 bg-bg-soft text-ink-700 disabled:opacity-100',
        )}
        onClick={onAdd}
        disabled={state !== 'available'}
        aria-hidden={state === 'loading'}
        aria-label={actionLabel(state, productName)}
        aria-describedby={state === 'limited' ? limitDescriptionId : undefined}
      >
        <ActionContent state={state} />
      </Button>
      {state === 'limited' && (
        <span id={limitDescriptionId} className="sr-only">
          Quitá un producto de tu consulta para seleccionar otro.
        </span>
      )}
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </CardAction>
  );
}

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

  const selectionState = getSelectionState(basket, product.id);

  function addProduct() {
    const outcome = addToBasket(product);
    const nextAnnouncement = getAnnouncement(outcome, product.name);

    if (outcome === 'limit-reached') setBasket(getBasket());
    if (nextAnnouncement) setAnnouncement(nextAnnouncement);
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
        <ProductAction
          state={selectionState}
          productName={product.name}
          limitDescriptionId={limitDescriptionId}
          announcement={announcement}
          onAdd={addProduct}
        />
      </CardHeader>
    </Card>
  );
}
