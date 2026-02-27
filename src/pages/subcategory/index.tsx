import { useParams } from 'react-router'
import ProductCatalog from '@/components/ProductCatalog'

function SubcategoryPage() {
  const { category, subcategory } = useParams()

  if (!category || !subcategory) {
    return <div>404 - Page not found</div>
  }

  return <ProductCatalog category={category} subcategory={subcategory} />
}

export default SubcategoryPage
