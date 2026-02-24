import styles from './medicamentos.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function MedicamentosPage() {
  const category = categories.find(c => c.nombre === 'Medicamentos')
  
  return (
    <section className={styles.container}>
      <h1>Medicamentos</h1>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} />
      )}
    </section>
  )
}

export default MedicamentosPage
