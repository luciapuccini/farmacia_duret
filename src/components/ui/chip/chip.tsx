import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { clsx } from 'clsx';

import styles from './chip.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  count?: number | string;
  selected?: boolean;
};

export default function Chip({
  children,
  className,
  count,
  selected = false,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      {...props}
      type={type}
      className={clsx(styles.chip, selected && styles.selected, className)}
    >
      <span>{children}</span>
      {count && <span className={styles.count}>{count}</span>}
    </button>
  );
}
