import styles from './cuidado-personal.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function CuidadoPersonalPage() {
  const category = categories.find(c => c.nombre === 'Cuidado Personal')
  
  return (
    <section className={styles.container}>
      <h1>Cuidado Personal</h1>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} />
      )}
    </section>
  )
}

export default CuidadoPersonalPage
