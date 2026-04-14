import { contentfulClient } from "./client";

export async function getCategories() {
	const entries = await contentfulClient.getEntries({
		content_type: "product",
	});
	return entries.items;
}

// export async function getCategoryBySlug(slug: string) {
// 	const entries = await contentfulClient.getEntries({
// 		content_type: "category",
// 		"fields.slug": slug,
// 		limit: 1,
// 	});
// 	return entries.items[0] ?? null;
// }
