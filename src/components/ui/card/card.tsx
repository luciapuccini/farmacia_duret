import type { HTMLAttributes, ReactNode } from 'react';

import { clsx } from 'clsx';

import styles from './card.module.scss';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
};

export default function Card({ children, className, interactive = false, ...props }: Props) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx(styles.card, interactive && styles.interactive, className)}
    >
      {children}
    </div>
  );
}
