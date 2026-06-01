import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./badge.module.scss";

type Props = HTMLAttributes<HTMLSpanElement> & {
	children: ReactNode;
};

export default function Badge({ children, className, ...props }: Props) {
	return (
		<span {...props} className={cx(styles.badge, className)}>
			{children}
		</span>
	);
}
