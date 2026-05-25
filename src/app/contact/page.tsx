import type { Metadata } from 'next'
import { safeJsonLd } from '@/utils/safeJsonLd'
import styles from './contact.module.scss'

export const metadata: Metadata = {
  title: 'Contacto | Farmacia Duret',
  description:
    'Dirección, teléfono, horarios y preguntas frecuentes de Farmacia Duret en Villa Rosa, Pilar del Este.',
}

const hours = [
  { day: 'Lunes',      time: '8:00 – 20:00' },
  { day: 'Martes',     time: '8:00 – 20:00' },
  { day: 'Miércoles',  time: '8:00 – 20:00' },
  { day: 'Jueves',     time: '8:00 – 20:00' },
  { day: 'Viernes',    time: '8:00 – 20:00' },
  { day: 'Sábado',     time: '8:00 – 20:00' },
  { day: 'Domingo',    time: 'Cerrado' },
]

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
]

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
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Contacto</h1>
        
        <div className={styles.grid}>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Dirección</h2>
            <address className={styles.address}>
              <a
                href="https://www.google.com/maps/place/Farmacia+Duret/@-34.4064716,-58.8588412,17z/data=!3m1!4b1!4m6!3m5!1s0x95bc9dc88cd56f9d:0x2f17665d565396da!8m2!3d-34.4064761!4d-58.8562663!16s%2Fg%2F11xkrnpz6y?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.addressLink}
              >
                Pilar del Este, E. Casella 1743<br />
                B1631 Villa Rosa<br />
                Provincia de Buenos Aires, Argentina
              </a>
            </address>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Teléfono</h2>
            <a href="tel:+541178942852" className={styles.phone}>
              +54 11 7894 2852
            </a>
          </section>
          </div>

           {/* ── Social strip ─────────────────────────────────── */}
        <div className={styles.socialStrip}>
          <div className={styles.socialInner}>
          <div className={styles.socialMsg}>
            <span className={styles.socialIcon} aria-hidden="true">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </span>
            <span>
              <b>Seguinos en redes</b>
              <br />
              Novedades, ofertas y más
            </span>
          </div>

          <div className={styles.socialLinks}>
            <a
              href="https://www.instagram.com/farmacia_duret"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span className={styles.socialLinkText}>
                <span className={styles.socialLinkN}>@farmacia_duret</span>
                <span className={styles.socialLinkL}>Instagram</span>
              </span>
              <span className={styles.socialIcon} aria-hidden="true">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </span>
            </a>

            <a
              href="https://wa.me/5491178942852"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span className={styles.socialLinkText}>
                <span className={styles.socialLinkN}>WhatsApp</span>
                <span className={styles.socialLinkL}>Escribinos</span>
              </span>
              <span className={styles.socialIcon} aria-hidden="true">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </span>
            </a>


          </div>
          </div>
        </div>

          <section className={`${styles.card} ${styles.cardWide}`}>
            <h2 className={styles.cardTitle}>Horarios</h2>
            <ul className={styles.hoursList}>
              {hours.map(({ day, time }) => (
                <li key={day} className={styles.hoursItem}>
                  <span>{day}</span>
                  <span className={time === 'Cerrado' ? styles.closed : undefined}>
                    {time}
                  </span>
                </li>
              ))}
            </ul>
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
  )
}
