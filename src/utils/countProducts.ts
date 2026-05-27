import productsData from "@/services/catalog/data/products.json";

export function countProductsByCategory(categorySlug: string): number {
	return productsData.filter((p) => p.category === categorySlug).length;
}
