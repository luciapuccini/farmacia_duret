import type { TextareaHTMLAttributes } from 'react';

import { clsx } from 'clsx';

import styles from './textarea.module.scss';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: Props) {
  return <textarea {...props} className={clsx(styles.textarea, className)} />;
}
