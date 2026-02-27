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
          <span>{category.nombre}</span>
          {hasSubcategories && <span className={styles.chevron}>›</span>}
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
          <span>{category.nombre}</span>
          {hasSubcategories && <span className={styles.chevron}>›</span>}
        </NavLink>
      ) : depth === 2 ? (
        <NavLink
          to={category.nombre === 'Ver todos los productos' ? parentPath : `${parentPath}?f=${categoryPath.slice(1)}`}
          className={styles.navItemButton}
          onClick={() => setIsOpen(false)}
        >
          <span>{category.nombre}</span>
        </NavLink>
      ) : (
        <button
          className={styles.navItemButton}
          onClick={() => hasSubcategories && setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>{category.nombre}</span>
          {hasSubcategories && <span className={styles.chevron}>›</span>}
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
      <div className={styles.navbar}>
        <div className={styles.navContent}>
          {isMobile && (
            <button
              className={styles.menuButton}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          )}

          <nav className={styles.navCategories}>
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
            <CtaButton to="/reservas" className={styles.navCta}>
              Reservas
            </CtaButton>
          </nav>

          
        </div>
      </div>

      {isMobile && (
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      )}
    </>
  )
}
