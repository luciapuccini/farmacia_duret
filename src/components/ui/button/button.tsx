import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { clsx } from 'clsx';

import styles from './button.module.scss';

type Variant = 'primary' | 'secondary';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
};

type ButtonProps = ComponentPropsWithoutRef<'button'> & BaseProps;

export default function Button(props: ButtonProps) {
  const { variant = 'primary', className, children, type = 'button', ...buttonProps } = props;

  return (
    <button
      type={type}
      {...buttonProps}
      className={clsx(styles.button, styles[variant], className)}
    >
      {children}
    </button>
  );
}
