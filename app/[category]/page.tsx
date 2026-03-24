import { notFound } from 'next/navigation'
import categories from '@/data/categories.json'
import SubCategoryGrid from '@/components/subCategoryGrid'

function nameToSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

type Props = {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params

  const matched = categories.find(c => nameToSlug(c.nombre) === category)

  if (!matched || !matched.subcategorias?.length) {
    notFound()
  }

  return (
    <SubCategoryGrid
      subcategories={matched.subcategorias}
      categorySlug={category}
    />
  )
}
