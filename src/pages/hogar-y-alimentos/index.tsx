import styles from './hogar-y-alimentos.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function HogarYAlimentosPage() {
  const category = categories.find(c => c.nombre === 'Hogar y Alimentos')
  
  return (
    <section className={styles.container}>
      <h1>Hogar y Alimentos</h1>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} />
      )}
    </section>
  )
}

export default HogarYAlimentosPage
