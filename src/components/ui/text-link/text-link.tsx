import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { clsx } from 'clsx';

import styles from './text-link.module.scss';

type Variant = 'primary' | 'secondary';

type Props = ComponentPropsWithoutRef<'a'> & {
  children: ReactNode;
  variant?: Variant;
  href: string;
};

export default function TextLink({ variant, children, className, href, ...props }: Props) {
  const defaultLinkStyles = clsx(styles.link, className);
  const asButtonStyles = clsx(styles.button, variant && styles[variant], className);
  const linkClassName = variant ? asButtonStyles : defaultLinkStyles;
  return (
    <a {...props} href={href} className={linkClassName}>
      {children}
    </a>
  );
}
