import type { InputHTMLAttributes } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./input.module.scss";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
	return <input {...props} className={cx(styles.input, className)} />;
}
