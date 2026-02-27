import { useParams } from 'react-router'
import ProductCatalog from '@/components/ProductCatalog'
import NotFoundPage from '@/pages/not-found'

function SubcategoryPage() {
  const { category, subcategory } = useParams()

  if (!category || !subcategory) return <NotFoundPage />

  return <ProductCatalog category={category} subcategory={subcategory} />
}

export default SubcategoryPage
