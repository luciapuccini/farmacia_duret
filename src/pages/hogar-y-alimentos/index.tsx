import styles from './hogar-y-alimentos.module.scss'
import SubCategoryGrid from '@/components/subCategoryGrid'
import categories from '@/data/categories.json'

function HogarYAlimentosPage() {
  const category = categories.find(c => c.nombre === 'Hogar y Alimentos')
  
  return (
    <section className={styles.container}>
      {category?.subcategorias && (
        <SubCategoryGrid subcategories={category.subcategorias} categorySlug="hogar-y-alimentos" />
      )}
    </section>
  )
}

export default HogarYAlimentosPage
