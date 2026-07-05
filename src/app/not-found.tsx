import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.description}>
        La página que buscás no existe o fue movida a otra dirección.
      </p>
      {/* TODO: Revisit CTA-styled navigation links once their shared semantics are clearer. */}
      <Link href="/" className={styles.link}>
        Volver al inicio
      </Link>
    </div>
  );
}
