import Link from 'next/link'
import styles from './subCategoryGrid.module.scss'
import { nameToSlug } from '@/utils/nameToSlug'

export interface SubCategory {
  nombre: string
  subcategorias?: SubCategory[]
}

interface SubCategoryGridProps {
  subcategories: SubCategory[]
  categorySlug?: string
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
]

function SubCategoryGrid({ subcategories, categorySlug }: SubCategoryGridProps) {
  return (
    <div className={styles.grid}>
      {subcategories.map((sub, index) => {
        const slug = nameToSlug(sub.nombre)
        const href = categorySlug ? `/${categorySlug}/${slug}` : `/${slug}`

        return (
          <Link key={sub.nombre} href={href} className={styles.card}>
            <div className={styles.thumb}>
              <img
                src={placeholderImages[index % placeholderImages.length]}
                alt={sub.nombre}
                className={styles.image}
              />
            </div>
            <div className={styles.meta}>
              <h3 className={styles.title}>{sub.nombre}</h3>
              <span className={styles.arrow} aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default SubCategoryGrid
