import { Link } from 'react-router'
import styles from './subCategoryGrid.module.scss'
import CtaButton from '@/components/CtaButton'

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

function nameToSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function SubCategoryGrid({ subcategories, categorySlug }: SubCategoryGridProps) {
  return (
    <div className={styles.grid}>
      {subcategories.map((sub, index) => {
        const slug = nameToSlug(sub.nombre)
        const linkUrl = categorySlug ? `/${categorySlug}/${slug}` : `/${slug}`
        
        return (
          <Link key={sub.nombre} to={linkUrl} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={placeholderImages[index % placeholderImages.length]}
                alt={sub.nombre}
                className={styles.image}
              />
            </div>
            <h3 className={styles.title}>{sub.nombre}</h3>
            {sub.subcategorias && sub.subcategorias.length > 0 && (
              <>
                <ul className={styles.list}>
                  {sub.subcategorias.slice(0, 3).map((item) => (
                    <li key={item.nombre} className={styles.listItem}>
                      {item.nombre}
                    </li>
                  ))}
                </ul>
                <CtaButton variant="card">Ver toda la categoría</CtaButton>
              </>
            )}
          </Link>
        )
      })}
    </div>
  )
}

export default SubCategoryGrid
