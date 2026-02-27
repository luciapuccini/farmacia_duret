import { useSearchParams } from 'react-router'
import categories from '@/data/categories.json'
import productsData from '@/data/products.json'
import styles from './catalog.module.scss'

type Product = {
  id: string
  name: string
  brand: string
  image: string
  current_offer: string | null
  category: string
  subcategory: string
  filter: string
}

type Filter = { label: string; slug: string }

function nameToSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function getFilters(categorySlug: string, subcategorySlug: string): Filter[] {
  for (const cat of categories) {
    if (nameToSlug(cat.nombre) !== categorySlug) continue
    for (const sub of cat.subcategorias ?? []) {
      if (nameToSlug(sub.nombre) !== subcategorySlug) continue
      return (sub.subcategorias ?? [])
        .filter(f => f.nombre !== 'Ver todos los productos')
        .map(f => ({ label: f.nombre, slug: nameToSlug(f.nombre) }))
    }
  }
  return []
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        {product.image
          ? <img src={product.image} alt={product.name} className={styles.cardImg} />
          : <div className={styles.cardImgPlaceholder} />
        }
        {product.current_offer && (
          <span className={styles.offerBadge}>{product.current_offer}</span>
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardBrand}>{product.brand}</p>
        <p className={styles.cardName}>{product.name}</p>
      </div>
    </div>
  )
}

type Props = { category: string; subcategory: string }

export default function ProductCatalog({ category, subcategory }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeFilter = searchParams.get('f')

  const filters = getFilters(category, subcategory)

  const products = (productsData as Product[]).filter(p => {
    if (p.category !== category || p.subcategory !== subcategory) return false
    if (activeFilter) return p.filter === activeFilter
    return true
  })

  function setFilter(slug: string | null) {
    setSearchParams(slug ? { f: slug } : {})
  }

  return (
    <div className={styles.catalog}>
      {filters.length > 0 && (
        <div className={styles.filterBar} role="toolbar" aria-label="Filtrar por categoría">
          <button
            className={`${styles.chip} ${!activeFilter ? styles.chipActive : ''}`}
            onClick={() => setFilter(null)}
          >
            Todos
          </button>
          {filters.map(({ label, slug }) => (
            <button
              key={slug}
              className={`${styles.chip} ${activeFilter === slug ? styles.chipActive : ''}`}
              onClick={() => setFilter(slug)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No hay productos disponibles en esta categoría.</p>
      )}
    </div>
  )
}
