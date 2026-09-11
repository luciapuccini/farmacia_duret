import type { ReactNode } from 'react';

import styles from '@/app/orders/components/InfoPanel/InfoPanel.module.scss';

export default function FootRow({
  iconPath,
  title,
  children,
}: {
  iconPath: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.footRow}>
      <span className={styles.footIcon}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconPath} />
        </svg>
      </span>
      <span>
        <b>{title}</b>
        {children}
      </span>
    </div>
  );
}
