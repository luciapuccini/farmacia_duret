import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import categories from "@/services/catalog/data/categories.json";
import { nameToSlug } from "@/utils/nameToSlug";

type CatalogCategory = {
	name: string;
	subcategories?: CatalogCategory[];
};

type SitemapEntry = MetadataRoute.Sitemap[number];

const catalogCategories = categories as CatalogCategory[];

function absoluteUrl(path: string): string {
	return new URL(path, SITE_URL).toString();
}

function route(
	path: string,
	changeFrequency: SitemapEntry["changeFrequency"],
	priority: number,
): SitemapEntry {
	return {
		url: absoluteUrl(path),
		changeFrequency,
		priority,
	};
}

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes = [
		route("/", "weekly", 1),
		route("/contact", "monthly", 0.8),
		route("/offers", "daily", 0.9),
		route("/orders", "monthly", 0.7),
	];

	const categoryRoutes = catalogCategories.flatMap((category) => {
		if (!category.subcategories?.length) {
			return [];
		}

		return route(`/${nameToSlug(category.name)}`, "weekly", 0.8);
	});

	const subcategoryRoutes = catalogCategories.flatMap((category) => {
		if (!category.subcategories?.length) {
			return [];
		}

		const categorySlug = nameToSlug(category.name);

		return category.subcategories.map((subcategory) =>
			route(`/${categorySlug}/${nameToSlug(subcategory.name)}`, "weekly", 0.7),
		);
	});

	return [...staticRoutes, ...categoryRoutes, ...subcategoryRoutes];
}
