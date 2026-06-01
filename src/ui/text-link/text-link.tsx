import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./text-link.module.scss";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
	children: ReactNode;
	href: string;
};

export default function TextLink({
	children,
	className,
	href,
	...props
}: Props) {
	const linkClassName = cx(styles.link, className);

	return (
		<a {...props} href={href} className={linkClassName}>
			{children}
		</a>
	);
}
