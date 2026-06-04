"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TSubcategory } from "@/types/types";
import { nameToSlug } from "@/utils/nameToSlug";
import styles from "./collapsibleSection.module.scss";

type CollapsibleSectionProps = {
	subcategory: TSubcategory;
};
const CollapsibleSection = ({ subcategory }: CollapsibleSectionProps) => {
	const router = useRouter();

	const isActive = false; //(filter: Category) => filter.name === activeFilter;

	function setFilter(
		categoryName: string,
		subCategoryName: string,
		filterName: string,
	) {
		router.replace(
			`/${nameToSlug(categoryName)}/${nameToSlug(subCategoryName)}/${nameToSlug(filterName)}`,
		);
	}

	return (
		<details className={styles.section}>
			<summary className={styles.section__title}>{subcategory.name}</summary>

			<ul>
				{subcategory.filters?.map((f) => {
					return (
						<details key={f.name}>
							<summary>{f.name}</summary>

							<ul>
								<li key={f.name}>
									<label htmlFor="activefilter">{f.name}</label>
									<input
										type="checkbox"
										value="activefilter"
										onClick={
											() => console.log("s")
											// setFilter(category.name, sc.name, f.name)
										}
									/>
								</li>
							</ul>
						</details>
					);
				})}
			</ul>
		</details>
	);
};

export default CollapsibleSection;
