import styles from './contact.module.scss'
import type { Metadata } from 'next'
import { safeJsonLd } from '@/utils/safeJsonLd'

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
            <a href="tel:+541176231044" className={styles.phone}>
              +54 11 7623-1044
            </a>
          </section>

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
        </div>

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
