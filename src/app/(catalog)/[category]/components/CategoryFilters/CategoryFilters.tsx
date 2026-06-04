import Link from "next/link";
import {
	ComponentProps,
	ComponentPropsWithoutRef,
	ComponentPropsWithRef,
} from "react";
import { nameToSlug } from "@/utils/nameToSlug";

import styles from "./CategoryFilters.module.scss";

type TCategoryFiltersProps = ComponentPropsWithRef<"aside"> & {};

function CategoryFilters(args: TCategoryFiltersProps) {
	/*
	FIXME: move as down as possible --> checkbox
	const router = useRouter();
	const pathname = usePathname();
	console.log("🚀 ~ searchParams:", router, pathname); */
	return (
		<aside className={styles.sidebar}>
			{[1, 2, 3].map((sc) => {
				return (
					<details key={"2"}>
						<summary> title</summary>
						content
					</details>
				);
			})}
		</aside>
	);
}

export default CategoryFilters;
