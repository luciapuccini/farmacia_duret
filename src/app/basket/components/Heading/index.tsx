'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Heading() {
  const router = useRouter();

  return (
    <div className="mb-3">
      <div className="flex">
        <div
          className="cursor-pointer hover:underline"
          role="presentation"
          onClick={() => {
            router.back();
          }}
        >
          <p className="mb-2 text-xs font-bold tracking-widest text-ink-500 uppercase">Catálogo</p>
        </div>
        <ChevronRight className="mx-1 h-[14px] w-[14px] text-ink-500" />
        <p className="mb-2 text-xs font-bold tracking-widest text-ink-500 uppercase">Carrito</p>
      </div>
      <h2 className="text-xl font-extrabold text-ink-900 md:text-2xl">
        Hacé tus pedidos por whatsapp.
      </h2>

      <p className="m-0 max-w-1/2 text-sm text-ink-700">
        completa tu telefono y nosotros te contactamos para mas información sobre tus productos.
      </p>
    </div>
  );
}
