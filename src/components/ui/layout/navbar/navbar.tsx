'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from '@/components/ui';
import categories from '@/services/catalog/data/categories.json';
import type { TCategory } from '@/types/types';
import { getBasket, subscribeToBasket, type Product } from '@/utils/basket';
import { nameToSlug } from '@/utils/nameToSlug';

import type { TCatalogLocation } from './categoryNode';
import Drawer from './components/drawer/drawer';
import SubnavRibbon from './components/subnav/subnav';
import styles from './navbar.module.scss';

function Brand() {
  return (
    <Link href="/" className={styles.brand}>
      <span className={styles.logoMark} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path d="M12 4v16M4 12h16" />
        </svg>
      </span>
      Farmacia Duret
    </Link>
  );
}

function PrimaryLinks({ pathname }: { pathname: string }) {
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className={styles.navLinks} aria-label="Navegación principal">
      <NavLink
        // FIXME: get first from catalog
        href="/dermocosmetica?sc=rostro&f=anti-edad"
        active={pathname === '/'}
        variant="nav"
      >
        Catálogo
      </NavLink>
      <NavLink href="/contact" active={isActive('/contact')} variant="nav">
        Contacto
      </NavLink>
    </nav>
  );
}

function BasketInquiryAction({ count }: { count: number }) {
  const inquiryLabel = count === 5 ? 'Consulta completa' : 'Consulta';
  const accessibleLabel = count === 5 ? 'Consulta completa' : 'Revisar consulta';

  return (
    <Link
      href="/basket"
      className={styles.inquiryAction}
      aria-label={`${accessibleLabel}: ${count} de 5 productos seleccionados`}
    >
      <ShoppingBag size={16} aria-hidden="true" />
      <span className={styles.inquiryCopy}>
        <span className={styles.inquiryLabel}>{inquiryLabel}</span>
        <span key={count} className={styles.inquiryCount}>
          {count} de 5
        </span>
      </span>
    </Link>
  );
}

function OrderLink() {
  return (
    <Link href="/orders" className={styles.navEncargo}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      Hacer un encargo
    </Link>
  );
}

function MenuButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className={styles.menuButton} onClick={onOpen} aria-label="Abrir menú">
      <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor" aria-hidden="true">
        <rect width="20" height="2" rx="1" />
        <rect y="7" width="20" height="2" rx="1" />
        <rect y="14" width="20" height="2" rx="1" />
      </svg>
    </button>
  );
}

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [basket, setBasket] = useState<Product[] | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const location: TCatalogLocation = {
    pathname,
    activeSubcategory: searchParams.get('sc'),
    activeFilter: searchParams.get('f'),
  };

  const isCatalogRoute = (categories as TCategory[]).some(
    (category) => pathname === `/${nameToSlug(category.name)}`,
  );
  const count = basket?.length ?? 0;

  useEffect(() => {
    const sync = () => setBasket(getBasket());
    sync();
    return subscribeToBasket(sync);
  }, []);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navTop}>
          <Brand />

          <PrimaryLinks pathname={pathname} />

          <div className={styles.navActions}>
            {isCatalogRoute && count > 0 && <BasketInquiryAction count={count} />}

            {/* TODO: Revisit CTA-styled navigation links once their shared semantics are clearer. */}
            <OrderLink />

            <MenuButton onOpen={() => setIsDrawerOpen(true)} />
          </div>
        </div>

        <SubnavRibbon location={location} />
      </header>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
