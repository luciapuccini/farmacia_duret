import styles from './salud-y-farmacia.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function SaludYFarmaciaPage() {
  const category = categories.find(c => c.nombre === 'Salud y Farmacia')
  
  return (
    <section className={styles.container}>
      <h1>Salud y Farmacia</h1>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} />
      )}
    </section>
  )
}

export default SaludYFarmaciaPage
