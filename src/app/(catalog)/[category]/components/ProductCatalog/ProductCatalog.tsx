import { TCatalogUrlParams } from '@/types/types';
import styles from './ProductCatalog.module.scss';
import { getProducts } from '@/services/actions/catalog';
import ProductCard from './components/ProductCard';

type Props = {
  url: TCatalogUrlParams;
};

export default function ProductCatalog({ url }: Props) {
  const products = getProducts(url);
  console.log('🚀 ~ products:', products);

  return (
    <div className={styles.catalog}>
      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No hay productos disponibles en esta categoría.</p>
      )}
    </div>
  );
}
