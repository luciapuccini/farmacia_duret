import { useParams } from 'react-router'
import { subcategoryComponents } from '@/helpers/subcategoryRoutes'

function SubcategoryPage() {
  const { category, subcategory } = useParams()
  
  if (!category || !subcategory) {
    return <div>404 - Page not found</div>
  }

  const categoryMap = subcategoryComponents[category]
  const Subcomponent = categoryMap?.[subcategory]

  if (!Subcomponent) {
    return <div>404 - Subcategory not found</div>
  }

  return <Subcomponent />
}

export default SubcategoryPage
