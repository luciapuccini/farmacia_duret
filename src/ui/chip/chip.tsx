import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./chip.module.scss";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	count?: number | string;
	selected?: boolean;
};

export default function Chip({
	children,
	className,
	count,
	selected = false,
	type = "button",
	...props
}: Props) {
	return (
		<button
			{...props}
			type={type}
			className={cx(styles.chip, selected && styles.selected, className)}
		>
			<span>{children}</span>
			{count !== undefined ? (
				<span className={styles.count}>{count}</span>
			) : null}
		</button>
	);
}
