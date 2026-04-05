import { notFound } from "next/navigation";
import ProductCatalog from "@/components/ProductCatalog";
import categories from "@/data/categories.json";
import { nameToSlug } from "@/utils/nameToSlug";

type Props = {
	params: Promise<{ category: string; subcategory: string }>;
};

export default async function SubcategoryPage({ params }: Props) {
	const { category, subcategory } = await params;

	const matchedCategory = categories.find(
		(c) => nameToSlug(c.nombre) === category,
	);
	if (!matchedCategory) notFound();

	const matchedSub = matchedCategory.subcategorias?.find(
		(s) => nameToSlug(s.nombre) === subcategory,
	);
	if (!matchedSub) notFound();

	return <ProductCatalog category={category} subcategory={subcategory} />;
}
