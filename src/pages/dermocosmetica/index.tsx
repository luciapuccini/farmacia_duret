import styles from './dermocosmetica.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function DermocosmeticaPage() {
  const category = categories.find(c => c.nombre === 'Dermocosmética')
  
  return (
    <section className={styles.container}>
      <h1>Dermocosmética</h1>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} />
      )}
    </section>
  )
}

export default DermocosmeticaPage
