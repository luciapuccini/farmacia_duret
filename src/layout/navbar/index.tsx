import React, { useState } from 'react'
import styles from './navbar.module.scss'
import categories from '../../data/categories.json'

type Category = {
  nombre: string
  subcategorias?: Category[]
}

type Props = { children?: React.ReactNode }

function NavItem({ category, depth = 0 }: { category: Category; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubcategories = category.subcategorias && category.subcategorias.length > 0

  return (
    <div
      className={styles.navItem}
      data-depth={depth}
      onMouseEnter={() => hasSubcategories && setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={styles.navItemButton}
        onClick={() => hasSubcategories && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{category.nombre}</span>
        {hasSubcategories && <span className={styles.chevron}>›</span>}
      </button>

      {hasSubcategories && isOpen && (
        <div className={styles.submenu} data-depth={depth}>
          {category.subcategorias.map((subcategory) => (
            <NavItem key={subcategory.nombre} category={subcategory} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar({ children }: Props) {
  return (
    <div className={styles.navbar}>
      <div className={styles.navContent}>
        <nav className={styles.navCategories}>
          {categories.map((category) => (
            <NavItem key={category.nombre} category={category} />
          ))}
        </nav>
        <div className={styles.navRight}>
          <button className={styles.navButton}>Action</button>
        </div>
      </div>
    </div>
  )
}
