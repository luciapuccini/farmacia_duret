import styles from './salud-y-farmacia.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function SaludYFarmaciaPage() {
  const category = categories.find(c => c.nombre === 'Salud y Farmacia')
  
  return (
    <section className={styles.container}>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} categorySlug="salud-y-farmacia" />
      )}
    </section>
  )
}

export default SaludYFarmaciaPage
