import productsData from "@/data/products.json";

export function countProductsByCategory(categorySlug: string): number {
	return productsData.filter((p) => p.category === categorySlug).length;
}

export function countProductsBySubcategory(
	categorySlug: string,
	subcategorySlug: string,
): number {
	return productsData.filter(
		(p) => p.category === categorySlug && p.subcategory === subcategorySlug,
	).length;
}
