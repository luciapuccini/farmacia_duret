import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./icon.module.scss";

type IconTone = "blue" | "green" | "gradient";
type IconSize = "sm" | "md" | "lg";

type Props = HTMLAttributes<HTMLSpanElement> & {
	children: ReactNode;
	tone?: IconTone;
	size?: IconSize;
};

export default function Icon({
	children,
	className,
	size = "lg",
	tone = "blue",
	...props
}: Props) {
	return (
		<span
			{...props}
			className={cx(styles.icon, styles[size], styles[tone], className)}
		>
			{children}
		</span>
	);
}
