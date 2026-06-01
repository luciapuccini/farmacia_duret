import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./text-link.module.scss";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
	children: ReactNode;
};

export default function TextLink({ children, className, ...props }: Props) {
	return (
		<a {...props} className={cx(styles.link, className)}>
			{children}
		</a>
	);
}
