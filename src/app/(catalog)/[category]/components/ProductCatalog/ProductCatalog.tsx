import { TCatalogUrlParams } from '@/types/types';
import styles from './ProductCatalog.module.scss';
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
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {products.map((product) => (
            <>
              <ProductCard key={product.id} {...product} />
            </>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No hay productos disponibles en esta categoría.</p>
      )}
    </div>
  );
}
