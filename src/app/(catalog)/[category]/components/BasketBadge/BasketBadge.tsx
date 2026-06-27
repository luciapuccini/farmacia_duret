'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { getBasket } from '@/utils/basket';

export function BasketBadge() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    function sync() {
      setCount(getBasket().length);
    }
    sync();
    window.addEventListener('basket:update', sync);
    return () => window.removeEventListener('basket:update', sync);
  }, []);

  if (count === 0) return null;

  return (
    <button
      onClick={() => router.push('/basket')}
      className="relative flex items-center justify-center p-2"
      aria-label={`Carrito (${count} productos)`}
    >
      <ShoppingBag className="h-6 w-6" />
      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
        {count}
      </span>
    </button>
  );
}
