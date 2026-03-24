import { notFound } from 'next/navigation'
import categories from '@/data/categories.json'
import ProductCatalog from '@/components/ProductCatalog'

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
  params: Promise<{ category: string; subcategory: string }>
}

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await params

  const matchedCategory = categories.find(c => nameToSlug(c.nombre) === category)
  if (!matchedCategory) notFound()

  const matchedSub = matchedCategory.subcategorias?.find(
    s => nameToSlug(s.nombre) === subcategory
  )
  if (!matchedSub) notFound()

  return <ProductCatalog category={category} subcategory={subcategory} />
}
