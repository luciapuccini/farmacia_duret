'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import categories from '@/services/catalog/data/categories.json';
import type { TCategory, TSubcategory } from '@/types/types';
import { NavLink } from '@/components/ui';
import {
  categoryNode,
  type TCatalogLocation,
  type TCatalogNode,
} from '@/components/ui/layout/navbar/categoryNode';

import { FilterDrawerItem, SecondLevelDrawerItem, TopLevelDrawerItem } from './drawerItem';
import styles from './drawer.module.scss';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type DrawerNavItemProps = {
  category: TCatalogNode;
  depth?: number;
  onNavigate: () => void;
  parentCategorySlug?: string;
  location: TCatalogLocation;
};

function DrawerNavItem({
  category,
  depth = 0,
  onNavigate,
  parentCategorySlug,
  location,
}: DrawerNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const node = categoryNode(category, depth, parentCategorySlug, location);
  const toggleOpen = () => setIsOpen((open) => !open);

  return (
    <div className={styles.drawerItem} data-depth={depth}>
      {depth === 0 && (
        <TopLevelDrawerItem
          category={category as TCategory}
          href={node.href}
          hasChildren={node.hasSubcategories}
          isActive={node.isActive}
          isOpen={isOpen}
          onNavigate={onNavigate}
          onToggle={toggleOpen}
        />
      )}

      {depth === 1 && parentCategorySlug && (
        <SecondLevelDrawerItem
          category={category as TSubcategory}
          href={node.href}
          hasFilters={node.hasFilters}
          isActive={node.isParentActive}
          isOpen={isOpen}
          onNavigate={onNavigate}
          onToggle={toggleOpen}
        />
      )}

      {node.hasSubcategories && isOpen && (
        <div className={styles.drawerSubmenu}>
          {node.subcategories.map((subcategory) => (
            <DrawerNavItem
              key={subcategory.name}
              category={subcategory}
              depth={depth + 1}
              onNavigate={onNavigate}
              parentCategorySlug={node.slug}
              location={location}
            />
          ))}
        </div>
      )}

      {node.hasFilters && isOpen && parentCategorySlug && (
        <div className={styles.drawerSubmenu}>
          {node.filters.map((filter) => (
            <div key={filter.name} className={styles.drawerItem} data-depth={depth + 1}>
              <FilterDrawerItem
                categorySlug={parentCategorySlug}
                subcategorySlug={node.slug}
                filter={filter}
                location={location}
                onNavigate={onNavigate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location: TCatalogLocation = {
    pathname,
    activeSubcategory: searchParams.get('sc'),
    activeFilter: searchParams.get('f'),
  };

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}

      <div
        className={styles.drawer}
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header: brand + close */}
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.drawerBrand} onClick={onClose}>
            Farmacia Duret
          </Link>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1 1l14 14M15 1L1 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className={styles.drawerNav} aria-label="Categorías">
          {(categories as TCategory[]).map((category) => (
            <DrawerNavItem
              key={category.name}
              category={category}
              onNavigate={onClose}
              location={location}
            />
          ))}
          <div className={styles.drawerItem} data-depth={0}>
            <NavLink
              href="/contact"
              active={pathname === '/contact'}
              onClick={onClose}
              variant="drawer"
            >
              Contacto
            </NavLink>
          </div>
        </nav>

        {/* Footer CTA */}
        <div className={styles.drawerFooter}>
          {/* TODO: Revisit CTA-styled navigation links once their shared semantics are clearer. */}
          <Link href="/orders" className={styles.drawerCta} onClick={onClose}>
            Hacer un encargo
          </Link>
        </div>
      </div>
    </>
  );
}
