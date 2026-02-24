import styles from './dermocosmetica.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function DermocosmeticaPage() {
  const category = categories.find(c => c.nombre === 'Dermocosmética')
  
  return (
    <section className={styles.container}>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} categorySlug="dermocosmetica" />
      )}
    </section>
  )
}

export default DermocosmeticaPage
