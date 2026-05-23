'use client'

import { usePathname } from 'next/navigation'
import { categoryNames, subcategoryNames } from './breadcrumb'
import styles from './layout.module.scss'

export default function PageHeader() {
  const pathname = usePathname()
  const pathParts = pathname.split('/').filter(Boolean)

  const category = pathParts[0]
  const subcategory = pathParts[1]

  const categoryName = category ? (categoryNames[category] || null) : null
  const subcategoryName = subcategory && category
    ? (subcategoryNames[category]?.[subcategory] || subcategory.replace(/-/g, ' '))
    : null

  const pageTitle = subcategoryName || categoryName

  if (!pageTitle) return null

  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{pageTitle}</h1>
    </div>
  )
}
