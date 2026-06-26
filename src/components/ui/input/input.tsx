import type { InputHTMLAttributes } from 'react';

import { clsx } from 'clsx';

import styles from './input.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return <input {...props} className={clsx(styles.input, className)} />;
}
