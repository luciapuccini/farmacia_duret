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
	variant = "primary",
	children,
	className,
	href,
	...props
}: Props) {
	const linkClassName = cx(styles.link, styles[variant], className);

	return (
		<a {...props} href={href} className={linkClassName}>
			{children}
		</a>
	);
}
