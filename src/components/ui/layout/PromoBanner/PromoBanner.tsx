import Link from 'next/link';
import styles from './PromoBanner.module.scss';

export default function PromoBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.message}>
          <span className={styles.dot} aria-hidden="true" />
          <span>
            Consulta farmacéutica <strong>sin cargo</strong> · Retiro en sucursal{' '}
            <strong>el mismo día</strong>
          </span>
        </div>
        <div className={styles.links}>
          <span className={styles.sep} aria-hidden="true" />
          <Link href="/privacy">Politica de privacidad</Link>
        </div>
      </div>
    </div>
  );
}
