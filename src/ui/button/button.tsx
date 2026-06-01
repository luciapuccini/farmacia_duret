import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./button.module.scss";

type ButtonVariant = "primary" | "secondary";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	variant?: ButtonVariant;
};

export default function Button({
	children,
	className,
	type = "button",
	variant = "primary",
	...props
}: Props) {
	return (
		<button
			{...props}
			type={type}
			className={cx(styles.button, styles[variant], className)}
		>
			{children}
		</button>
	);
}
