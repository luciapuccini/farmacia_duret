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
            <span>{category.nombre}</span>
          </NavLink>

          {hasSubcategories && (
            <button
              type="button"
              className={styles.drawerToggle}
              data-open={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={`Mostrar ${category.nombre}`}
              aria-expanded={isOpen}
            >
              <span className={styles.arrow} data-open={isOpen}>
                ‹
              </span>
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
          <span>{category.nombre}</span>
          {hasSubcategories && (
            <span className={styles.arrow} data-open={isOpen}>
              ›
            </span>
          )}
        </NavLink>
      ) : !hasSubcategories ? (
        <NavLink
          to={category.nombre === 'Ver todos los productos' ? parentPath : `${parentPath}?f=${categoryPath.slice(1)}`}
          className={styles.drawerItemButton}
          onClick={onNavigate}
        >
          <span>{category.nombre}</span>
        </NavLink>
      ) : (
        <button
          type="button"
          className={styles.drawerItemButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>{category.nombre}</span>
          <span className={styles.arrow} data-open={isOpen}>›</span>
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
      {/* Backdrop */}
      {isOpen && (
        <div className={styles.backdrop} onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={styles.drawer} data-open={isOpen}>
        <div className={styles.drawerHeader}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className={styles.drawerNav}>
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
              <span>Contacto</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  )
}
