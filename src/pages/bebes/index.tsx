import styles from './bebes.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function BebesPage() {
  const category = categories.find(c => c.nombre === 'Bebes')
  
  return (
    <section className={styles.container}>
      <h1>Bebés</h1>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} />
      )}
    </section>
  )
}

export default BebesPage
