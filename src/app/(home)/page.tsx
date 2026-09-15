import type { Metadata } from 'next';
import HeroSection from '@/app/(home)/components/HeroSection/HeroSection';
import InfoStrip from '@/app/(home)/components/InfoStrip/InfoStrip';
import styles from './home.module.scss';
import Offers from './components/offers/offers';

const description =
  'Farmacia de confianza en Villa Rosa, Pilar del Este. Medicamentos, dermocosmética, cuidado personal y productos para bebés. Encargá online por WhatsApp y retirá en sucursal.';

export const metadata: Metadata = {
  title: 'Farmacia Duret | Tu farmacia de confianza en Villa Rosa',
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Farmacia Duret | Tu farmacia de confianza en Villa Rosa',
    description,
    url: '/',
    siteName: 'Farmacia Duret',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Farmacia Duret | Tu farmacia de confianza en Villa Rosa',
    description,
  },
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HeroSection />

      <InfoStrip />

      <Offers />
    </div>
  );
}
