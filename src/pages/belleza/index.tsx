import styles from './belleza.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function BellezaPage() {
  const category = categories.find(c => c.nombre === 'Belleza')
  
  return (
    <section className={styles.container}>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} categorySlug="belleza" />
      )}
    </section>
  )
}

export default BellezaPage
