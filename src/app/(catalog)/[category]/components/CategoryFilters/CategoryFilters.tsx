import type { ComponentPropsWithRef } from "react";
import type { TCategory } from "@/types/types";
import CollapsibleSection from "../CollapsibleSection/collapsibleSection";
import styles from "./CategoryFilters.module.scss";

type TCategoryFiltersProps = ComponentPropsWithRef<"aside"> & {
	category: TCategory;
};

function CategoryFilters({ category }: TCategoryFiltersProps) {
	console.log("🚀 ~ category:", category);
	/*
	FIXME: move as down as possible --> checkbox
	const router = useRouter();
	const pathname = usePathname();
	console.log("🚀 ~ searchParams:", router, pathname); */

	return (
		<aside className={styles.sidebar}>
			{category.subcategories ? (
				category.subcategories.map((sc) => {
					return <CollapsibleSection key={sc.name} subcategory={sc} />;
				})
			) : (
				<p>nada...</p>
			)}
		</aside>
	);
}

export default CategoryFilters;
