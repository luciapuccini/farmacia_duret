import React from 'react'
import styles from './footer.module.scss'

type Props = { children?: React.ReactNode }

export default function Footer({ children }: Props) {
  return <div className={styles.footer}>{children}</div>
}
