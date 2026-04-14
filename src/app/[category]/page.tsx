import { notFound } from "next/navigation";
import SubCategoryGrid from "@/components/subCategoryGrid";
import categories from "@/data/categories.json";
import { getCategories } from "@/services/contentful/categories";
import { nameToSlug } from "@/utils/nameToSlug";

type Props = {
	params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
	const { category } = await params;

	// TODO: replace with request to contentful
	const categoriesv2 = await getCategories();
	console.log("🚀 ~ CategoryPage ~ categoriesv2:", categoriesv2);
	const matched = categories.find((c) => nameToSlug(c.nombre) === category);

	if (!matched || !matched.subcategorias?.length) {
		notFound();
	}

	return (
		<SubCategoryGrid
			subcategories={matched.subcategorias}
			categorySlug={category}
		/>
	);
}
