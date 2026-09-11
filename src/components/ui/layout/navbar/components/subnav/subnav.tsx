'use client';

import { useState } from 'react';
import categories from '@/services/catalog/data/categories.json';
import type { TCategory, TFilters } from '@/types/types';
import { NavLink } from '@/components/ui';
import {
  categoryNode,
  filterNode,
  type TCatalogLocation,
  type TCatalogNode,
} from '@/components/ui/layout/navbar/categoryNode';
import styles from '@/components/ui/layout/navbar/navbar.module.scss';

function dropdownClass(depth: number) {
  return depth === 0 ? styles.dropdown : `${styles.dropdown} ${styles.dropdownNested}`;
}

function FilterItem({
  categorySlug,
  subcategorySlug,
  filter,
  location,
}: {
  categorySlug: string;
  subcategorySlug: string;
  filter: TFilters;
  location: TCatalogLocation;
}) {
  const { href, isActive } = filterNode(filter, categorySlug, subcategorySlug, location);

  return (
    <li className={styles.subnavItem}>
      <NavLink href={href} active={isActive} variant="dropdown">
        {filter.name}
      </NavLink>
    </li>
  );
}

function SubnavItem({
  category,
  depth = 0,
  parentCategorySlug,
  location,
}: {
  category: TCatalogNode;
  depth?: number;
  parentCategorySlug?: string;
  location: TCatalogLocation;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const node = categoryNode(category, depth, parentCategorySlug, location);

  return (
    <li
      className={styles.subnavItem}
      onMouseEnter={() => (node.hasSubcategories || node.hasFilters) && setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <NavLink
        href={node.href}
        active={node.isActive}
        variant={depth === 0 ? 'subnav' : 'dropdown'}
      >
        {category.name}
      </NavLink>

      {node.hasSubcategories && isOpen && (
        <ul className={dropdownClass(depth)}>
          {node.subcategories.map((sub) => (
            <SubnavItem
              key={sub.name}
              category={sub}
              depth={depth + 1}
              parentCategorySlug={depth === 0 ? node.slug : parentCategorySlug}
              location={location}
            />
          ))}
        </ul>
      )}

      {node.hasFilters && isOpen && parentCategorySlug && (
        <ul className={dropdownClass(depth)}>
          {node.filters.map((filter) => (
            <FilterItem
              key={filter.name}
              categorySlug={parentCategorySlug}
              subcategorySlug={node.slug}
              filter={filter}
              location={location}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Sub-nav ribbon — desktop only. Opens on hover. */
export default function SubnavRibbon({ location }: { location: TCatalogLocation }) {
  const subnavCategories = (categories as TCategory[]).filter((c) => c.name !== 'Ofertas');

  return (
    <nav className={styles.subnav} aria-label="Categorías">
      <div className={styles.subnavInner}>
        <ul className={styles.subnavList}>
          {subnavCategories.map((cat) => (
            <SubnavItem key={cat.name} category={cat} location={location} />
          ))}
        </ul>
      </div>
    </nav>
  );
}
