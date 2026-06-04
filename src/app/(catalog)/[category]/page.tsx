import { notFound } from "next/navigation";
import categories from "@/services/catalog/data/categories.json";
import { nameToSlug } from "@/utils/nameToSlug";
import ProductCatalog from "./[subcategory]/components/ProductCatalog/ProductCatalog";
import CategoryFilters from "./components/CategoryFilters/CategoryFilters";

import style from "./page.module.scss";

type TCatalogUrl = {
	category: string;
	subcategory: string;
	filter: string;
};

type Props = {
	params: Promise<TCatalogUrl>;
};

export default async function CategoryPage({ params }: Props) {
	const { category } = await params;
	// console.log("🚀 ~ url:", url);

	const matched = categories.find((c) => nameToSlug(c.name) === category);

	if (!matched || !matched.subcategories?.length) {
		notFound();
	}

	return (
		<div className={style.page}>
			<CategoryFilters />

			{/* <ProductCatalog url={url} /> */}
		</div>
	);
}
