import { notFound } from 'next/navigation';
import categories from '@/services/catalog/data/categories.json';
import type { TCatalogUrlParams, TCategory } from '@/types/types';
import { nameToSlug } from '@/utils/nameToSlug';
import CategoryFilters from './components/CategoryFilters/CategoryFilters';
import ProductCatalog from './components/ProductCatalog/ProductCatalog';
import styles from './page.module.scss';

type Slug = string;

type Props = {
  params: Promise<TCatalogUrlParams>;
  searchParams: Promise<{ sc?: Slug; f?: Slug }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { sc: subcategory = '', f: filter = '' } = await searchParams;

  const matched = categories.find((c) => nameToSlug(c.name) === category);

  if (!matched || !matched.subcategories?.length) {
    notFound();
  }

  const categoryObject = categories.find((c) => nameToSlug(c.name) === category) as TCategory;

  return (
    <div className={styles.page}>
      <div className={styles.sectHead}>
        <div>
          <p className={styles.sectLabel}>Catálogo</p>
          <h2 className={styles.sectTitle}>Hacé tus pedidos por whatsapp.</h2>
          <p className={styles.sectSub}>
            consultas hasta 10 productos, sujetos a disponibilidad y precios
          </p>
        </div>
      </div>
      <div className={styles.content}>
        <CategoryFilters category={categoryObject} activeSc={subcategory} />
        <ProductCatalog url={{ category, subcategory, filter }} />
      </div>
    </div>
  );
}
