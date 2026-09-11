import type { TCategory, TFilters, TSubcategory } from '@/types/types';
import { NavLink } from '@/components/ui';
import { filterNode, type TCatalogLocation } from '@/components/ui/layout/navbar/categoryNode';

import styles from './drawer.module.scss';

function ChevronDown() {
  return (
    <svg
      className={styles.chevron}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      className={styles.chevron}
      width="6"
      height="10"
      viewBox="0 0 6 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToggleChevron({ isOpen }: { isOpen: boolean }) {
  return isOpen ? <ChevronDown /> : <ChevronRight />;
}

export function TopLevelDrawerItem({
  category,
  href,
  hasChildren,
  isActive,
  isOpen,
  onNavigate,
  onToggle,
}: {
  category: TCategory;
  href: string;
  hasChildren: boolean;
  isActive: boolean;
  isOpen: boolean;
  onNavigate: () => void;
  onToggle: () => void;
}) {
  return (
    <div className={styles.drawerItemHeader}>
      <NavLink href={href} active={isActive} onClick={onNavigate} variant="drawer">
        {category.name}
      </NavLink>

      {hasChildren && (
        <button
          type="button"
          className={styles.drawerToggle}
          onClick={onToggle}
          aria-label={`${isOpen ? 'Ocultar' : 'Mostrar'} ${category.name}`}
          aria-expanded={isOpen}
        >
          <ToggleChevron isOpen={isOpen} />
        </button>
      )}
    </div>
  );
}

export function SecondLevelDrawerItem({
  category,
  href,
  hasFilters,
  isActive,
  isOpen,
  onNavigate,
  onToggle,
}: {
  category: TSubcategory;
  href: string;
  hasFilters: boolean;
  isActive: boolean;
  isOpen: boolean;
  onNavigate: () => void;
  onToggle: () => void;
}) {
  return (
    <div className={styles.drawerItemHeader}>
      <NavLink href={href} active={isActive} onClick={onNavigate} variant="drawer">
        {category.name}
      </NavLink>

      {hasFilters && (
        <button
          type="button"
          className={styles.drawerToggle}
          onClick={onToggle}
          aria-label={`${isOpen ? 'Ocultar' : 'Mostrar'} ${category.name}`}
          aria-expanded={isOpen}
        >
          <ToggleChevron isOpen={isOpen} />
        </button>
      )}
    </div>
  );
}

export function FilterDrawerItem({
  categorySlug,
  subcategorySlug,
  filter,
  location,
  onNavigate,
}: {
  categorySlug: string;
  subcategorySlug: string;
  filter: TFilters;
  location: TCatalogLocation;
  onNavigate: () => void;
}) {
  const { href, isActive } = filterNode(filter, categorySlug, subcategorySlug, location);

  return (
    <NavLink href={href} active={isActive} onClick={onNavigate} variant="drawer">
      {filter.name}
    </NavLink>
  );
}
