import categories from "@/services/catalog/data/categories.json";
import productsData from "@/services/catalog/data/products.json";
import { TCatalogUrlParams } from "@/types/types";
import { nameToSlug } from "@/utils/nameToSlug";
import styles from "./ProductCatalog.module.scss";

type Product = {
	id: string;
	name: string;
	brand: string;
	image: string;
	current_offer: string | null;
	category: string;
	subcategory: string;
	filter: string;
};

// type Filter = { label: string; slug: string };

// function getFilters(categorySlug: string, subcategorySlug: string): Filter[] {
// 	for (const cat of categories) {
// 		if (nameToSlug(cat.name) !== categorySlug) continue;
// 		for (const sub of cat.subcategories ?? []) {
// 			if (nameToSlug(sub.name) !== subcategorySlug) continue;
// 			return (sub.subcategories ?? [])
// 				.filter((f) => f.name !== "Ver todos los productos")
// 				.map((f) => ({ label: f.name, slug: nameToSlug(f.name) }));
// 		}
// 	}
// 	return [];
// }

function getProducts(url: { [key: string]: string }) {
	// /belleza/maquillaje/ojos
	// /belleza/maquillaje

	const { category, subcategory, filter } = url;

	let productsFiltered = [];
	if (filter) {
		productsFiltered = productsData.filter((product) => {
			if (
				product.filter === filter &&
				product.subcategory === subcategory &&
				product.category === category
			) {
				return product;
			}
			return null;
		});
	}

	productsFiltered = productsData.filter((product) => {
		if (product.subcategory === subcategory && product.category === category) {
			return product;
		}
		return null;
	});
	return productsFiltered;
}

function ProductCard({ product }: { product: Product }) {
	return (
		<div className={styles.card}>
			{product.current_offer && (
				<span className={styles.offerBadge}>{product.current_offer}</span>
			)}
			<div className={styles.cardImage}>
				{product.image ? (
					<img
						src={product.image}
						alt={product.name}
						className={styles.cardImg}
					/>
				) : (
					<div className={styles.cardImgPlaceholder} />
				)}
			</div>
			<div className={styles.cardBody}>
				<p className={styles.cardBrand}>{product.brand}</p>
				<p className={styles.cardName}>{product.name}</p>
			</div>
		</div>
	);
}

type Props = {
	url: TCatalogUrlParams;
};

export default function ProductCatalog({ url }: Props) {
	const products = getProducts(url);
	return (
		<div className={styles.catalog}>
			catalog
			{products.length > 0 ? (
				<div className={styles.grid}>
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
				<p className={styles.empty}>
					No hay productos disponibles en esta categoría.
				</p>
			)}
		</div>
	);
}
