import './globals.scss'
import Navbar from '@/layout/navbar'
import Footer from '@/layout/footer'
import Container from '@/layout/container'
import Breadcrumb from '@/layout/breadcrumb'
import PageHeader from '@/layout/PageHeader'

export const metadata = {
  title: 'Farmacia Duret',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <Container>
          <PageHeader />
          <Breadcrumb />
          {children}
        </Container>
        <Footer />
      </body>
    </html>
  )
}
