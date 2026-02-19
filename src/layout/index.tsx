import React from 'react'
import styles from './layout.module.scss'

type Props = { children?: React.ReactNode }

export function Navbar({ children }: Props) {
  return (
    <div className={styles.navbar}>
      <div className={styles.navLeft}>{children}</div>
      <div className={styles.navRight}>
        <button className={styles.navButton}>Action</button>
      </div>
    </div>
  )
}

export function Footer({ children }: Props) {
  return <div className={styles.footer}>{children}</div>
}

export function Container({ children }: Props) {
  return <div className={styles.container}>{children}</div>
}

export default function Layout({ children }: Props) {
  return (
    <div className={styles.page}>
      <Navbar>Navbar</Navbar>
      <Container>{children}</Container>
      <Footer>Footer</Footer>
    </div>
  )
}
