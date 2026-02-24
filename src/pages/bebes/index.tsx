import styles from './bebes.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function BebesPage() {
  const category = categories.find(c => c.nombre === 'Bebes')
  
  return (
    <section className={styles.container}>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} categorySlug="bebes" />
      )}
    </section>
  )
}

export default BebesPage
