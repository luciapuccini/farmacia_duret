import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { clsx } from 'clsx';

import styles from './nav-link.module.scss';

type Props = ComponentProps<typeof Link> & {
  children: ReactNode;
  active?: boolean;
  variant?: 'nav' | 'subnav' | 'dropdown' | 'drawer';
};

export default function NavLink({
  children,
  active = false,
  className,
  variant = 'nav',
  ...props
}: Props) {
  return (
    <Link
      {...props}
      aria-current={active ? 'page' : undefined}
      className={clsx(styles.link, styles[variant], active && styles[`${variant}Active`], className)}
    >
      {children}
    </Link>
  );
}
