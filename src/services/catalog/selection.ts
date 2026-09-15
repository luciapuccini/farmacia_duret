import categories from '@/services/catalog/data/categories.json';
import type { TCategory, TFilters, TSubcategory } from '@/types/types';
import { nameToSlug } from '@/utils/nameToSlug';

export type TCatalogSelection = {
  category: TCategory;
  subcategory?: TSubcategory;
  filter?: TFilters;
  titleParts: string[];
  canonical: string;
  title: string;
  description: string;
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

function catalogDescription(
  category: TCategory,
  subcategory?: TSubcategory,
  filter?: TFilters,
): string {
  if (filter && subcategory) {
    return `Encontrá ${filter.name} en ${subcategory.name}, ${category.name}. Consultá disponibilidad y precios por WhatsApp en Farmacia Duret, Villa Rosa.`;
  }

  if (subcategory) {
    return `Explorá ${subcategory.name} en ${category.name}. Pedí por WhatsApp en Farmacia Duret, Villa Rosa.`;
  }

  return `Catálogo de ${category.name} en Farmacia Duret. Consultá productos y hacé tu pedido por WhatsApp en Villa Rosa.`;
}

// A category with no subcategories counts as a miss, same as an unknown one.
function matchCategory(categorySlug: string): TCategory | undefined {
  const matched = findCategory(categorySlug);
  return matched?.subcategories?.length ? matched : undefined;
}

function catalogTitleParts(
  category: TCategory,
  subcategory?: TSubcategory,
  filter?: TFilters,
): string[] {
  const parts = [category.name];
  if (subcategory) parts.push(subcategory.name);
  if (filter) parts.push(filter.name);
  return parts;
}

/**
 * Resolves a catalog URL triple against the category tree.
 * Returns `undefined` on a miss; callers own the 404.
 */
export function resolveCatalogSelection(
  categorySlug: string,
  subcategorySlug?: string,
  filterSlug?: string,
): TCatalogSelection | undefined {
  const category = matchCategory(categorySlug);
  if (!category) return undefined;

  const subcategory = subcategorySlug ? findSubcategory(category, subcategorySlug) : undefined;
  const filter = subcategory && filterSlug ? findFilter(subcategory, filterSlug) : undefined;
  const titleParts = catalogTitleParts(category, subcategory, filter);

  return {
    category,
    subcategory,
    filter,
    titleParts,
    // Slugs are passed on only when the entity actually matched.
    canonical: catalogCanonicalPath(
      categorySlug,
      subcategory ? subcategorySlug : undefined,
      filter ? filterSlug : undefined,
    ),
    title: catalogTitle(titleParts),
    description: catalogDescription(category, subcategory, filter),
  };
}
