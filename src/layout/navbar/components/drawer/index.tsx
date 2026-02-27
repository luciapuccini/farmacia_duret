import { useState } from 'react'
import { NavLink } from 'react-router'
import styles from './drawer.module.scss'
import categories from '@/data/categories.json'
import { categoryNameToPath } from '@/helpers/routes'

type Category = {
  nombre: string
  subcategorias?: Category[]
}

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
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
    <svg className={styles.chevron} width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
      <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DrawerNavItem({
  category,
  depth = 0,
  onNavigate,
  parentPath = '',
}: {
  category: Category
  depth?: number
  onNavigate: () => void
  parentPath?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubcategories = category.subcategorias && category.subcategorias.length > 0
  const categoryPath = categoryNameToPath(category.nombre)
  const isTopLevel = depth === 0

  return (
    <div className={styles.drawerItem} data-depth={depth}>
      {isTopLevel ? (
        <div className={styles.drawerItemHeader}>
          <NavLink
            to={categoryPath}
            className={({ isActive }) =>
              isActive
                ? `${styles.drawerItemButton} ${styles.drawerItemButtonActive}`
                : styles.drawerItemButton
            }
            onClick={onNavigate}
          >
            {category.nombre}
          </NavLink>

          {hasSubcategories && (
            <button
              type="button"
              className={styles.drawerToggle}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={`${isOpen ? 'Ocultar' : 'Mostrar'} ${category.nombre}`}
              aria-expanded={isOpen}
            >
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
          )}
        </div>
      ) : depth === 1 ? (
        <NavLink
          to={`${parentPath}/${categoryPath}`}
          className={({ isActive }) =>
            isActive
              ? `${styles.drawerItemButton} ${styles.drawerItemButtonActive}`
              : styles.drawerItemButton
          }
          onClick={onNavigate}
        >
          {category.nombre}
          {hasSubcategories && <ChevronRight />}
        </NavLink>
      ) : !hasSubcategories ? (
        <NavLink
          to={category.nombre === 'Ver todos los productos' ? parentPath : `${parentPath}?f=${categoryPath.slice(1)}`}
          className={styles.drawerItemButton}
          onClick={onNavigate}
        >
          {category.nombre}
        </NavLink>
      ) : (
        <button
          type="button"
          className={styles.drawerItemButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {category.nombre}
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </button>
      )}

      {hasSubcategories && isOpen && (
        <div className={styles.drawerSubmenu}>
          {category.subcategorias?.map((subcategory) => (
            <DrawerNavItem
              key={subcategory.nombre}
              category={subcategory}
              depth={depth + 1}
              onNavigate={onNavigate}
              parentPath={depth === 0 ? categoryPath : `${parentPath}${categoryPath}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  return (
    <>
      {isOpen && (
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      )}

      <div className={styles.drawer} data-open={isOpen} role="dialog" aria-modal="true" aria-label="Menú de navegación">

        {/* Header: brand + close */}
        <div className={styles.drawerHeader}>
          <NavLink to="/" className={styles.drawerBrand} onClick={onClose}>
            Farmacia Duret
          </NavLink>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className={styles.drawerNav} aria-label="Categorías">
          {categories.map((category: Category) => (
            <DrawerNavItem key={category.nombre} category={category} onNavigate={onClose} />
          ))}
          <div className={styles.drawerItem} data-depth={0}>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                isActive
                  ? `${styles.drawerItemButton} ${styles.drawerItemButtonActive}`
                  : styles.drawerItemButton
              }
              onClick={onClose}
            >
              Contacto
            </NavLink>
          </div>
        </nav>

        {/* Footer CTA */}
        <div className={styles.drawerFooter}>
          <NavLink to="/reservas" className={styles.drawerCta} onClick={onClose}>
            Hacer un encargo
          </NavLink>
        </div>

      </div>
    </>
  )
}
