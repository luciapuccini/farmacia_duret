import { useParams } from 'react-router'
import { categoryComponents } from '@/helpers/categoryRoutes'

function CategoryPage() {
  const { category } = useParams()
  
  if (!category) {
    return <div>404 - Page not found</div>
  }

  const CategoryComponent = categoryComponents[category]

  if (!CategoryComponent) {
    return <div>404 - Category not found</div>
  }

  return <CategoryComponent />
}

export default CategoryPage
