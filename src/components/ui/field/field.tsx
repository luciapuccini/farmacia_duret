import type { HTMLAttributes, ReactNode } from 'react';

import { clsx } from 'clsx';

import styles from './field.module.scss';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  optionalLabel?: ReactNode;
};

export default function Field({
  children,
  className,
  error,
  hint,
  htmlFor,
  label,
  optionalLabel,
  required = false,
  ...props
}: Props) {
  return (
    <div {...props} className={clsx(styles.field, className)}>
      {label ? (
        <label className={styles.label} htmlFor={htmlFor}>
          <span>{label}</span>
          {required ? <span className={styles.required}>*</span> : null}
          {optionalLabel ? <span className={styles.optional}>{optionalLabel}</span> : null}
        </label>
      ) : null}
      {children}
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
