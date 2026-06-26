import './globals.css';
import './reset.scss';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_URL } from '@/config/site';
import Container from '@/components/ui/container/container';
import Footer from '@/components/ui/layout/footer/footer';
import Navbar from '@/components/ui/layout/navbar/navbar';
import PromoBanner from '@/components/ui/layout/PromoBanner/PromoBanner';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Farmacia Duret',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PromoBanner />
        <Suspense>
          <Navbar />
        </Suspense>
        <Container>{children}</Container>
        <Footer />
      </body>
    </html>
  );
}
