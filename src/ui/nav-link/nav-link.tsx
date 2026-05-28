import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./nav-link.module.scss";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
	children: ReactNode;
	active?: boolean;
};

export default function NavLink({
	children,
	active = false,
	className,
	...props
}: Props) {
	return (
		<a
			{...props}
			aria-current={active ? "page" : undefined}
			className={cx(styles.link, active && styles.active, className)}
		>
			{children}
		</a>
	);
}
