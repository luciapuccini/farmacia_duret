import type { Metadata } from 'next';
import ContactSection from '@/app/contact/components/ContactSection/ContactSection';
import FaqSection from '@/app/contact/components/FaqSection/FaqSection';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { description, faqJsonLd, pharmacyJsonLd } from './contact.data';
import styles from './contact.module.scss';

export const metadata: Metadata = {
  title: 'Contacto | Farmacia Duret',
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contacto | Farmacia Duret',
    description,
    url: '/contact',
    siteName: 'Farmacia Duret',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contacto | Farmacia Duret',
    description,
  },
};

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(pharmacyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <div className={styles.container}>
        <ContactSection />

        <FaqSection />
      </div>
    </>
  );
}
