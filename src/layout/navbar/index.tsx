import React from 'react'
import styles from './navbar.module.scss'

type Props = { children?: React.ReactNode }

export default function Navbar({ children }: Props) {
  return (
    <div className={styles.navbar}>
      <div className={styles.navLeft}>{children}</div>
      <div className={styles.navRight}>
        <button className={styles.navButton}>Action</button>
      </div>
    </div>
  )
}
