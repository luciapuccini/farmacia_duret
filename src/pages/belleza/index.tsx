import styles from './belleza.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function BellezaPage() {
  const category = categories.find(c => c.nombre === 'Belleza')
  
  return (
    <section className={styles.container}>
      <h1>Belleza</h1>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} />
      )}
    </section>
  )
}

export default BellezaPage
