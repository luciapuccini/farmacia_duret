import { useState } from 'react'
import { NavLink } from 'react-router'
import styles from './navbar.module.scss'
import Drawer from './components/drawer'
import categories from '@/data/categories.json'
import { useMediaQuery } from '@/helpers/hooks'
import { categoryNameToPath } from '@/helpers/routes'
import CtaButton from '@/components/CtaButton'

type Category = {
  nombre: string
  subcategorias?: Category[]
}

function ChevronDown() {
  return (
    <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className={styles.chevronRight} width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
      <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NavItem({ category, depth = 0, parentPath = '' }: { category: Category; depth?: number; parentPath?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubcategories = category.subcategorias && category.subcategorias.length > 0
  const categoryPath = categoryNameToPath(category.nombre)

  return (
    <div
      className={styles.navItem}
      data-depth={depth}
      onMouseEnter={() => hasSubcategories && setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {depth === 0 ? (
        <NavLink
          to={categoryPath}
          className={({ isActive }) =>
            isActive
              ? `${styles.navItemButton} ${styles.navItemButtonActive}`
              : styles.navItemButton
          }
          aria-expanded={isOpen}
        >
          {category.nombre}
          {hasSubcategories && <ChevronDown />}
        </NavLink>
      ) : depth === 1 ? (
        <NavLink
          to={`${parentPath}/${categoryPath}`}
          className={({ isActive }) =>
            isActive
              ? `${styles.navItemButton} ${styles.navItemButtonActive}`
              : styles.navItemButton
          }
        >
          {category.nombre}
          {hasSubcategories && <ChevronRight />}
        </NavLink>
      ) : depth === 2 ? (
        <NavLink
          to={category.nombre === 'Ver todos los productos' ? parentPath : `${parentPath}?f=${categoryPath.slice(1)}`}
          className={styles.navItemButton}
        >
          {category.nombre}
        </NavLink>
      ) : (
        <button
          className={styles.navItemButton}
          onClick={() => hasSubcategories && setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {category.nombre}
          {hasSubcategories && <ChevronRight />}
        </button>
      )}

      {hasSubcategories && isOpen && (
        <div className={styles.submenu} data-depth={depth}>
          {category.subcategorias?.map((subcategory) => (
            <NavItem
              key={subcategory.nombre}
              category={subcategory}
              depth={depth + 1}
              parentPath={depth === 0 ? categoryPath : `${parentPath}${categoryPath}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <>
      <header className={styles.navbar}>

        {/* Top row: brand + CTA (desktop) / brand + hamburger (mobile) */}
        <div className={styles.navTop}>
          <NavLink to="/" className={styles.brand}>
            Farmacia Duret
          </NavLink>

          {/* Desktop CTA */}
          <CtaButton to="/reservas" className={styles.navCta}>
            Hacer un encargo
          </CtaButton>

          {/* Mobile hamburger */}
          <button
            className={styles.menuButton}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor" aria-hidden="true">
              <rect width="20" height="2" rx="1" />
              <rect y="7" width="20" height="2" rx="1" />
              <rect y="14" width="20" height="2" rx="1" />
            </svg>
          </button>
        </div>

        {/* Categories row — desktop only */}
        <nav className={styles.navCategories} aria-label="Categorías">
          {categories.map((category) => (
            <NavItem key={category.nombre} category={category} />
          ))}
          <div className={styles.navItem} data-depth={0}>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navItemButton} ${styles.navItemButtonActive}`
                  : styles.navItemButton
              }
            >
              Contacto
            </NavLink>
          </div>
        </nav>

      </header>

      {isMobile && (
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      )}
    </>
  )
}
