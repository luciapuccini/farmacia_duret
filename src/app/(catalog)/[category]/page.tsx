import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import categories from '@/services/catalog/data/categories.json';
import type { TCatalogUrlParams, TCategory, TSubcategory } from '@/types/types';
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

function findCategory(categorySlug: string): TCategory | undefined {
  return categories.find((category) => nameToSlug(category.name) === categorySlug);
}

function findSubcategory(category: TCategory, subcategorySlug: string): TSubcategory | undefined {
  return category.subcategories?.find(
    (subcategory) => nameToSlug(subcategory.name) === subcategorySlug,
  );
}

function findFilter(subcategory: TSubcategory, filterSlug: string) {
  return subcategory.filters?.find((filter) => nameToSlug(filter.name) === filterSlug);
}

function catalogCanonicalPath(
  categorySlug: string,
  subcategorySlug?: string,
  filterSlug?: string,
): string {
  if (subcategorySlug && filterSlug) {
    const category = findCategory(categorySlug);
    const subcategory = category && findSubcategory(category, subcategorySlug);
    const filter = subcategory && findFilter(subcategory, filterSlug);
    if (filter?.url) return filter.url;

    const searchParams = new URLSearchParams({ sc: subcategorySlug, f: filterSlug });
    return `/${categorySlug}?${searchParams.toString()}`;
  }

  if (subcategorySlug) {
    const searchParams = new URLSearchParams({ sc: subcategorySlug });
    return `/${categorySlug}?${searchParams.toString()}`;
  }

  return `/${categorySlug}`;
}

function catalogTitle(parts: string[]): string {
  return `${parts.join(' · ')} | Farmacia Duret`;
}

function catalogDescription(category: string, subcategory?: string, filter?: string): string {
  if (filter && subcategory) {
    return `Encontrá ${filter} en ${subcategory}, ${category}. Consultá disponibilidad y precios por WhatsApp en Farmacia Duret, Villa Rosa.`;
  }

  if (subcategory) {
    return `Explorá ${subcategory} en ${category}. Pedí por WhatsApp en Farmacia Duret, Villa Rosa.`;
  }

  return `Catálogo de ${category} en Farmacia Duret. Consultá productos y hacé tu pedido por WhatsApp en Villa Rosa.`;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params;
  const { sc: subcategory = '', f: filter = '' } = await searchParams;

  const categorySlug = nameToSlug(category);
  const subcategorySlug = nameToSlug(subcategory);
  const filterSlug = nameToSlug(filter);

  const matched = findCategory(categorySlug);

  if (!matched?.subcategories?.length) {
    notFound();
  }

  const matchedSubcategory = subcategorySlug
    ? findSubcategory(matched, subcategorySlug)
    : undefined;
  const matchedFilter =
    matchedSubcategory && filterSlug ? findFilter(matchedSubcategory, filterSlug) : undefined;

  const titleParts = [matched.name];
  if (matchedSubcategory) titleParts.push(matchedSubcategory.name);
  if (matchedFilter) titleParts.push(matchedFilter.name);

  const canonical = catalogCanonicalPath(
    categorySlug,
    matchedSubcategory ? subcategorySlug : undefined,
    matchedFilter ? filterSlug : undefined,
  );
  const title = catalogTitle(titleParts);
  const description = catalogDescription(
    matched.name,
    matchedSubcategory?.name,
    matchedFilter?.name,
  );

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

  const matched = findCategory(cat);

  if (!matched?.subcategories?.length) {
    notFound();
  }

  const categoryObject = matched;

  return (
    <div>
      <div className={styles.sectHead}>
        <div>
          <p className={styles.sectLabel}>Catálogo</p>
          <h2 className="text-xl font-extrabold text-ink-900 md:text-2xl">
            Hacé tus pedidos por whatsapp.
          </h2>
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
