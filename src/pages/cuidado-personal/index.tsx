import styles from './cuidado-personal.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function CuidadoPersonalPage() {
  const category = categories.find(c => c.nombre === 'Cuidado Personal')
  
  return (
    <section className={styles.container}>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} categorySlug="cuidado-personal" />
      )}
    </section>
  )
}

export default CuidadoPersonalPage
