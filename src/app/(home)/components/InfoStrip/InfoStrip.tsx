import InfoMessage from '@/app/(home)/components/InfoMessage/InfoMessage';
import InfoStats from '@/app/(home)/components/InfoStats/InfoStats';
import styles from '@/app/(home)/home.module.scss';

export default function InfoStrip() {
  return (
    <div role="presentation" className={styles.infoStrip}>
      <InfoMessage />

      <InfoStats />
    </div>
  );
}
