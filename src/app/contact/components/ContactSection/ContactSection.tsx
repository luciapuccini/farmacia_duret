import { TextLink } from '@/components/ui';
import MapPanel from '@/app/contact/components/MapPanel/MapPanel';
import ScheduleCard from '@/app/contact/components/ScheduleCard/ScheduleCard';
import SocialRow from '@/app/contact/components/SocialRow/SocialRow';
import { pharmacyPhone } from '@/app/contact/contact.data';
import styles from '@/app/contact/contact.module.scss';

export default function ContactSection() {
  return (
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
            <SocialRow />

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

            <ScheduleCard />
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
                  <TextLink href={`tel:${pharmacyPhone}`}>+54 11 7894 2852</TextLink>
                </p>
              </div>
            </div>
          </div>

          <MapPanel />
        </div>
      </div>
    </section>
  );
}
