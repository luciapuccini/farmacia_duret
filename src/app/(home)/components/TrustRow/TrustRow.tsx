import styles from '@/app/(home)/home.module.scss';

export default function TrustRow() {
  return (
    <div className={styles.trustRow}>
      <div className={styles.trustItem}>
        <span className={styles.trustIcon}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </span>
        <span className={styles.trustLabel}>
          <b>Envíos a domicilio</b> Consultar zonas
        </span>
      </div>
      <div className={styles.trustItem}>
        <span className={`${styles.trustIcon} ${styles.trustIconGreen}`}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </span>
        <span className={styles.trustLabel}>
          <b>Retiro el mismo día</b>Lun–Sáb 8:00–20:00
        </span>
      </div>
      <div className={styles.trustItem}>
        <span className={styles.trustIcon}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span className={styles.trustLabel}>
          <b>Asesoría farmacéutica</b>Sin cargo
        </span>
      </div>
    </div>
  );
}
