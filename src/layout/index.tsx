import React from 'react'
import Navbar from './navbar'
import Footer from './footer'
import styles from './layout.module.scss'

type Props = { children?: React.ReactNode }

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
