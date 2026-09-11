import type { TCategory, TFilters, TSubcategory } from '@/types/types';
import { nameToSlug } from '@/utils/nameToSlug';

export type TCatalogNode = TCategory | TSubcategory;

/** Current route, as the catalog reads it. */
export type TCatalogLocation = {
  pathname: string;
  activeSubcategory: string | null;
  activeFilter: string | null;
};

export type TCategoryNode = {
  slug: string;
  href: string;
  subcategories: TSubcategory[];
  filters: TFilters[];
  hasSubcategories: boolean;
  hasFilters: boolean;
  /** The node's own link is the current selection. */
  isActive: boolean;
  /** The parent category page is the current page. */
  isParentActive: boolean;
};

export type TFilterNode = {
  slug: string;
  href: string;
  isActive: boolean;
};

export function filterHref(categorySlug: string, subcategorySlug: string, filterSlug: string) {
  const searchParams = new URLSearchParams({ sc: subcategorySlug, f: filterSlug });
  return `/${categorySlug}?${searchParams.toString()}`;
}

export function subcategoryHref(categorySlug: string, subcategorySlug: string) {
  const searchParams = new URLSearchParams({ sc: subcategorySlug });
  return `/${categorySlug}?${searchParams.toString()}`;
}

function subcategoriesOf(category: TCatalogNode): TSubcategory[] {
  return 'subcategories' in category ? (category.subcategories ?? []) : [];
}

function filtersOf(category: TCatalogNode): TFilters[] {
  return 'filters' in category ? (category.filters ?? []) : [];
}

/** Derives everything a nav item renders from a catalog node, its depth and its parent slug. */
export function categoryNode(
  category: TCatalogNode,
  depth: number,
  parentCategorySlug: string | undefined,
  location: TCatalogLocation,
): TCategoryNode {
  const slug = nameToSlug(category.name);
  const subcategories = subcategoriesOf(category);
  const filters = filtersOf(category);
  const href =
    depth === 0 || !parentCategorySlug ? `/${slug}` : subcategoryHref(parentCategorySlug, slug);
  const isParentActive =
    parentCategorySlug !== undefined && location.pathname === `/${parentCategorySlug}`;

  return {
    slug,
    href,
    subcategories,
    filters,
    hasSubcategories: subcategories.length > 0,
    hasFilters: filters.length > 0,
    isActive:
      depth === 0
        ? location.pathname === href
        : isParentActive && location.activeSubcategory === slug,
    isParentActive,
  };
}

export function filterNode(
  filter: TFilters,
  categorySlug: string,
  subcategorySlug: string,
  location: TCatalogLocation,
): TFilterNode {
  const slug = nameToSlug(filter.name);

  return {
    slug,
    href: filter.url || filterHref(categorySlug, subcategorySlug, slug),
    isActive:
      location.pathname === `/${categorySlug}` &&
      location.activeSubcategory === subcategorySlug &&
      location.activeFilter === slug,
  };
}
