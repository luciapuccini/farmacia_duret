import React from 'react'
import styles from './container.module.scss'

type Props = { children?: React.ReactNode }

export default function Container({ children }: Props) {
  return <main className={styles.container}>{children}</main>
}
