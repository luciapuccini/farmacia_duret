import { notFound } from "next/navigation";
import ProductCatalog from "@/app/(catalog)/[category]/[subcategory]/components/ProductCatalog/ProductCatalog";
import categories from "@/services/catalog/data/categories.json";
import { nameToSlug } from "@/utils/nameToSlug";

type Props = {
	params: Promise<{ category: string; subcategory: string }>;
};

export default async function SubcategoryPage({ params }: Props) {
	const { category, subcategory } = await params;

	const matchedCategory = categories.find(
		(c) => nameToSlug(c.name) === category,
	);
	if (!matchedCategory) notFound();

	const matchedSub = matchedCategory.subcategories?.find(
		(s) => nameToSlug(s.name) === subcategory,
	);
	if (!matchedSub) notFound();

	return <ProductCatalog category={category} subcategory={subcategory} />;
}
