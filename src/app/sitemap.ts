import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import categories from "@/services/catalog/data/categories.json";
import type { TCategory } from "@/types/types";
import { nameToSlug } from "@/utils/nameToSlug";

type SitemapEntry = MetadataRoute.Sitemap[number];

const catalogCategories = categories as TCategory[];

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

function subcategoryPath(categorySlug: string, subcategorySlug: string): string {
	const searchParams = new URLSearchParams({ sc: subcategorySlug });
	return `/${categorySlug}?${searchParams.toString()}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes = [
		route("/", "weekly", 1),
		route("/contact", "monthly", 0.8),
		route("/offers", "daily", 0.9),
		route("/orders", "monthly", 0.7),
		route("/privacy", "yearly", 0.3),
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
			route(
				subcategoryPath(categorySlug, nameToSlug(subcategory.name)),
				"weekly",
				0.7,
			),
		);
	});

	const filterRoutes = catalogCategories.flatMap((category) =>
		category.subcategories?.flatMap(
			(subcategory) =>
				subcategory.filters?.map((filter) =>
					route(filter.url, "weekly", 0.6),
				) ?? [],
		) ?? [],
	);

	return [...staticRoutes, ...categoryRoutes, ...subcategoryRoutes, ...filterRoutes];
}
