import React from 'react'
import Navbar from './navbar'
import Footer from './footer'
import Container from './container'
import styles from './layout.module.scss'

type Props = { children?: React.ReactNode }

export default function Layout({ children }: Props) {
  return (
    <div className={styles.page}>
      <Navbar />
      <Container>{children}</Container>
      <Footer>Footer</Footer>
    </div>
  )
}

export { default as Container } from './container'
