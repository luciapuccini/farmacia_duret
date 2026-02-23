import { useState } from 'react'
import styles from './drawer.module.scss'
import categories from '@/data/categories.json'

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
  depth = 0 
}: { 
  category: Category
  depth?: number 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubcategories = category.subcategorias && category.subcategorias.length > 0

  return (
    <div className={styles.drawerItem} data-depth={depth}>
      <button
        className={styles.drawerItemButton}
        onClick={() => hasSubcategories && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{category.nombre}</span>
        {hasSubcategories && (
          <span className={styles.arrow} data-open={isOpen}>
            ‹
          </span>
        )}
      </button>

      {hasSubcategories && isOpen && (
        <div className={styles.drawerSubmenu}>
          {category.subcategorias?.map((subcategory) => (
            <DrawerNavItem
              key={subcategory.nombre}
              category={subcategory}
              depth={depth + 1}
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
            <DrawerNavItem key={category.nombre} category={category} />
          ))}
        </nav>
      </div>
    </>
  )
}
