import { NavLink, useLocation } from 'react-router'
import styles from './breadcrumb.module.scss'

const BASE_URL = 'https://www.farmaciaduret.com'

const categoryNames: Record<string, string> = {
  'dermocosmetica': 'Dermocosmética',
  'belleza': 'Belleza',
  'cuidado-personal': 'Cuidado Personal',
  'bebes': 'Bebés',
  'hogar-y-alimentos': 'Hogar y Alimentos',
  'salud-y-farmacia': 'Salud y Farmacia',
  'medicamentos': 'Medicamentos',
  'ofertas': 'Ofertas',
}

const subcategoryNames: Record<string, Record<string, string>> = {
  'dermocosmetica': {
    'rostro': 'Rostro',
    'corporal': 'Corporal',
    'pelo': 'Pelo',
  },
  'belleza': {
    'maquillaje': 'Maquillaje',
    'perfumes-y-fragancias': 'Perfumes y Fragancias',
    'cuidado-de-la-piel': 'Cuidado de la Piel',
    'accesorios-de-belleza': 'Accesorios de Belleza',
    'electro-belleza': 'Electro Belleza',
    'cuidado-capilar': 'Cuidado Capilar',
    'moda': 'Moda',
    'novedades-y-sorteos': 'Novedades y Sorteos',
  },
  'cuidado-personal': {
    'cuidado-capilar': 'Cuidado Capilar',
    'cuidado-oral': 'Cuidado Oral',
    'adultos': 'Adultos',
    'higiene-personal': 'Higiene Personal',
    'repelentes': 'Repelentes',
    'novedades-y-sorteos': 'Novedades y Sorteos',
  },
  'bebes': {
    'nutricion-infantil': 'Nutrición Infantil',
    'panales': 'Pañales',
    'lactancia': 'Lactancia',
    'cuidado-materno': 'Cuidado Materno',
    'higiene-del-bebe': 'Higiene del Bebé',
  },
  'hogar-y-alimentos': {
    'desayuno-y-merienda': 'Desayuno y Merienda',
    'alimentacion-saludable': 'Alimentación Saludable',
    'limpieza-y-desinfeccion': 'Limpieza y Desinfección',
    'libreria': 'Librería',
    'electronica-y-pilas': 'Electrónica y Pilas',
    'hogar-y-deco': 'Hogar y Deco',
    'papeles': 'Papeles',
  },
  'salud-y-farmacia': {
    'servicios-de-salud': 'Servicios de Salud',
    'farmacia': 'Farmacia',
    'nutricion-y-deportes': 'Nutrición y Deportes',
    'nutricion-infantil': 'Nutrición Infantil',
    'bienestar-sexual': 'Bienestar Sexual',
    'electrosalud': 'Electrosalud',
  },
  'medicamentos': {
    'venta-libre': 'Venta Libre',
    'venta-bajo-receta': 'Venta Bajo Receta',
  },
}

function formatCategoryName(slug: string): string {
  return categoryNames[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatSubcategoryName(category: string, slug: string): string {
  return subcategoryNames[category]?.[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function Breadcrumb() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)

  if (pathParts.length === 0) {
    return null
  }

  const category = pathParts[0]
  const subcategory = pathParts[1]

  const categoryName = formatCategoryName(category)
  const subcategoryName = subcategory ? formatSubcategoryName(category, subcategory) : null

  const breadcrumbItems = [
    { name: 'Inicio', url: BASE_URL },
    ...(categoryName ? [{ name: categoryName, url: `${BASE_URL}/${category}` }] : []),
    ...(subcategoryName ? [{ name: subcategoryName, url: `${BASE_URL}/${category}/${subcategory}` }] : []),
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(index < breadcrumbItems.length - 1 ? { item: item.url } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <NavLink to="/" className={styles.breadcrumbLink}>
            Inicio
          </NavLink>
        </li>
        
        {categoryName && (
          <li className={styles.breadcrumbItem}>
            <span className={styles.separator}>›</span>
            <NavLink to={`/${category}`} className={styles.breadcrumbLink}>
              {categoryName}
            </NavLink>
          </li>
        )}
        
        {subcategoryName && (
          <li className={styles.breadcrumbItem}>
            <span className={styles.separator}>›</span>
            <span className={styles.currentPage}>{subcategoryName}</span>
          </li>
        )}
      </ol>
    </nav>
    </>
  )
}
