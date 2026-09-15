import { TextLink } from '@/components/ui';
import { googleMapsEmbedUrl, googleMapsUrl } from '@/app/contact/contact.data';
import styles from '@/app/contact/contact.module.scss';

export default function MapPanel() {
  return (
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
  );
}
