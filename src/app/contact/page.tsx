import type { Metadata } from 'next';
import { TextLink } from '@/components/ui';
import { safeJsonLd } from '@/utils/safeJsonLd';
import styles from './contact.module.scss';

const description =
  'Dirección, teléfono, horarios y preguntas frecuentes de Farmacia Duret en Villa Rosa, Pilar del Este.';

const googleMapsUrl =
  'https://www.google.com/maps/place/Farmacia+Duret/@-34.4064716,-58.8588412,17z/data=!3m1!4b1!4m6!3m5!1s0x95bc9dc88cd56f9d:0x2f17665d565396da!8m2!3d-34.4064761!4d-58.8562663!16s%2Fg%2F11xkrnpz6y?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D';

const googleMapsEmbedUrl =
  'https://www.google.com/maps?q=Farmacia%20Duret%2C%20E.%20Casella%201743%2C%20Villa%20Rosa%2C%20Buenos%20Aires&z=16&output=embed';

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

const faqs = [
  {
    question: '¿Dónde está ubicada Farmacia Duret?',
    answer:
      'Farmacia Duret está en Pilar del Este, E. Casella 1743, Villa Rosa, Provincia de Buenos Aires.',
  },
  {
    question: '¿Cuál es el horario de atención?',
    answer:
      'Atendemos de lunes a sábado de 8:00 a 20:00. Los domingos la farmacia permanece cerrada.',
  },
  {
    question: '¿Puedo consultar disponibilidad de productos antes de ir?',
    answer:
      'Sí. Podés comunicarte por teléfono o iniciar una reserva por WhatsApp para consultar disponibilidad de medicamentos, productos de farmacia, dermocosmética, cuidado personal y ofertas.',
  },
  {
    question: '¿Puedo hacer un pedido por WhatsApp?',
    answer:
      'Sí. Desde la sección de reservas podés preparar un mensaje de WhatsApp con los productos que necesitás para continuar la atención directamente con la farmacia.',
  },
  {
    question: '¿Venden medicamentos con receta?',
    answer:
      'Sí. Para medicamentos que requieren receta, acercate a la farmacia o consultá previamente para confirmar los requisitos y la disponibilidad.',
  },
  {
    question: '¿La información del sitio reemplaza una consulta médica?',
    answer:
      'No. La información del sitio es orientativa. Para indicaciones de uso, tratamientos o dudas de salud, consultá con un profesional de la salud o con el equipo de la farmacia.',
  },
];

export default function ContactoPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <div className={styles.container}>
        <section className={styles.contact}>
          <div className={styles.wrap}>
            <div className={styles.introHeader}>
              <span className={styles.eyebrow}>
                <span className={styles.dot}></span>Visitanos
              </span>
              <h2 className={styles.introTitle}>Estamos cerca, siempre.</h2>
              <p className={styles.introText}>
                Pasá cuando quieras — no hace falta turno para una consulta rápida. Y si preferís,
                escribinos por WhatsApp.
              </p>
            </div>

            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <div className={styles.socialRow}>
                  <a
                    href="https://www.instagram.com/farmacia_duret"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </span>
                    <div>@farmacia_duret</div>
                  </a>
                  <a
                    href="https://wa.me/5491178942852"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </span>
                    <div>WhatsApp</div>
                  </a>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactCardIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4>Dirección</h4>
                    <p>
                      Pilar del Este, E. Casella 1743 B1631 Villa Rosa Provincia de Buenos Aires,
                      Argentina
                    </p>
                  </div>
                </div>

                <div className={styles.scheduleCard}>
                  <h3>
                    <span className={styles.dotLive}></span>
                    Horarios de atención
                  </h3>
                  <div className={styles.scheduleRow}>
                    <span className={styles.day}>Lunes</span>
                    <span className={styles.time}>8:00 – 20:00</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span className={styles.day}>Martes</span>
                    <span className={styles.time}>8:00 – 20:00</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span className={styles.day}>Miércoles</span>
                    <span className={styles.time}>8:00 – 20:00</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span className={styles.day}>Jueves</span>
                    <span className={styles.time}>8:00 – 20:00</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span className={styles.day}>Viernes</span>
                    <span className={styles.time}>8:00 – 20:00</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span className={styles.day}>Sábado</span>
                    <span className={styles.time}>8:00 – 20:00</span>
                  </div>
                  <div className={`${styles.scheduleRow} ${styles.closed}`}>
                    <span className={styles.day}>Domingo</span>
                    <span className={styles.time}>Cerrado</span>
                  </div>
                </div>
                <div className={styles.contactCard}>
                  <div className={`${styles.contactCardIcon} ${styles.mint}`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Teléfono</h4>
                    <p>
                      <TextLink href="tel:+541178942852">+54 11 7894 2852</TextLink>
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.mapSlot}>
                <iframe
                  title="Google Maps - Farmacia Duret"
                  src={googleMapsEmbedUrl}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className={styles.mapFrame}
                />
                <div className={styles.mapBar}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  <TextLink href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Abrir en Google Maps →
                  </TextLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.faqHeader}>
            <h2 id="faq-title" className={styles.faqTitle}>
              Preguntas frecuentes
            </h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map(({ question, answer }) => (
              <article key={question} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{question}</h3>
                <p className={styles.faqAnswer}>{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
