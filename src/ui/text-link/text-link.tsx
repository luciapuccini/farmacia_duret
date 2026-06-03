import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./text-link.module.scss";

type Variant = "primary" | "secondary";

type Props = ComponentPropsWithoutRef<"a"> & {
	children: ReactNode;
	variant?: Variant;
	href: string;
};

export default function TextLink({
	variant,
	children,
	className,
	href,
	...props
}: Props) {
	const defaultLinkStyles = cx(styles.link, className);
	const asButtonStyles = cx(
		styles.button,
		variant && styles[variant],
		className,
	);
	const linkClassName = variant ? asButtonStyles : defaultLinkStyles;
	return (
		<a {...props} href={href} className={linkClassName}>
			{children}
		</a>
	);
}
