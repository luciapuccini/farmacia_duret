import type { TextareaHTMLAttributes } from "react";

import { cx } from "@/ui/utils/cx";

import styles from "./textarea.module.scss";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: Props) {
	return <textarea {...props} className={cx(styles.textarea, className)} />;
}
