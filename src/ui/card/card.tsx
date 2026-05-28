import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./card.module.scss";

type Props = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	interactive?: boolean;
};

export default function Card({
	children,
	className,
	interactive = false,
	...props
}: Props) {
	return (
		<div
			{...props}
			className={cx(styles.card, interactive && styles.interactive, className)}
		>
			{children}
		</div>
	);
}
