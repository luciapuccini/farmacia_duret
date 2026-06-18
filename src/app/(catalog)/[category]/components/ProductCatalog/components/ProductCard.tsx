import { TProduct } from '@/services/actions/catalog';
import { ComponentProps } from 'react';

type ProductCard = ComponentProps<'div'> & { product: TProduct };

export default function ProductCard({ product }: ProductCard) {
  return (
    <div className="">
      {product.current_offer && <span className="">{product.current_offer}</span>}
      <div className="">
        {product.image ? (
          <img src={product.image} alt={product.name} className="" />
        ) : (
          <div className="" />
        )}
      </div>
      <div className="">
        <p className="">{product.brand}</p>
        <p className="">{product.name}</p>
      </div>
    </div>
  );
}
