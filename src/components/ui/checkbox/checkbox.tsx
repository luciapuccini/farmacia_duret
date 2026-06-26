import type { InputHTMLAttributes, ReactNode } from 'react';

import { clsx } from 'clsx';

import styles from './checkbox.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode;
};

export default function Checkbox({ className, id, label, ...props }: Props) {
  return (
    <label className={clsx(styles.root, className)} htmlFor={id}>
      <input {...props} className={styles.input} id={id} type="checkbox" />
      <span className={styles.box} aria-hidden="true" />
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
}
