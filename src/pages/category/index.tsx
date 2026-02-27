import { useParams } from 'react-router'
import { categoryComponents } from '@/helpers/categoryRoutes'
import NotFoundPage from '@/pages/not-found'

function CategoryPage() {
  const { category } = useParams()

  if (!category) return <NotFoundPage />

  const CategoryComponent = categoryComponents[category]

  if (!CategoryComponent) return <NotFoundPage />

  return <CategoryComponent />
}

export default CategoryPage
