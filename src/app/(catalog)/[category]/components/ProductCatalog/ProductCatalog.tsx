import { TCatalogUrlParams } from '@/types/types';
import { getProducts } from '@/services/actions/catalog';
import { ProductCard } from './components/ProductCard';

type Props = {
  url: TCatalogUrlParams;
};

export default function ProductCatalog({ url }: Props) {
  const products = getProducts(url);

  return (
    <div className="flex w-full">
      {products.length > 0 ? (
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="m-0 py-8 text-[0.9rem] text-ink-500">
          No hay productos disponibles en esta categoría.
        </p>
      )}
    </div>
  );
}
