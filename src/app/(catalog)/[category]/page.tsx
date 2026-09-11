import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveCatalogSelection } from '@/services/catalog/selection';
import type { TCatalogUrlParams } from '@/types/types';
import { nameToSlug } from '@/utils/nameToSlug';
import CategoryFilters from './components/CategoryFilters/CategoryFilters';
import ProductCatalog from './components/ProductCatalog/ProductCatalog';
import { BasketBadge } from './components/BasketBadge/BasketBadge';
import styles from './page.module.scss';

type Slug = string;

type Props = {
  params: Promise<TCatalogUrlParams>;
  searchParams: Promise<{ sc?: Slug; f?: Slug }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params;
  const { sc: subcategory = '', f: filter = '' } = await searchParams;

  const selection = resolveCatalogSelection(
    nameToSlug(category),
    nameToSlug(subcategory),
    nameToSlug(filter),
  );

  if (!selection) {
    notFound();
  }

  const { title, description, canonical } = selection;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Farmacia Duret',
      locale: 'es_AR',
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { sc: subcategory = '', f: filter = '' } = await searchParams;

  // FIXME: isolate to make sure from url to down the tree its always in slug format -->zod
  const cat = nameToSlug(category);
  const subc = nameToSlug(subcategory);
  const fil = nameToSlug(filter);

  const selection = resolveCatalogSelection(cat, subc, fil);

  if (!selection) {
    notFound();
  }

  const categoryObject = selection.category;

  return (
    <div>
      <div className={styles.sectHead}>
        <div>
          <p className={styles.sectLabel}>Catálogo</p>
          <h2 className={styles.sectTitle}>Hacé tus pedidos por whatsapp.</h2>
          <p className={styles.sectSub}>
            consultas hasta 5 productos, sujetos a disponibilidad y precios
          </p>
        </div>
        <BasketBadge />
      </div>
      <div className="flex gap-8 py-4">
        <CategoryFilters category={categoryObject} activeSc={subcategory} />
        <ProductCatalog url={{ category: cat, subcategory: subc, filter: fil }} />
      </div>
    </div>
  );
}
