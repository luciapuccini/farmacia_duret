import styles from '@/app/(home)/home.module.scss';

export default function InfoMessage() {
  return (
    <div className={styles.infoMsg}>
      <span className={styles.infoIcon} aria-hidden="true">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </span>
      <span>
        <b>Farmacia Duret</b> · Estamos en Villa Rosa,
        <br />
        Provincia de Buenos Aires
      </span>
    </div>
  );
}
