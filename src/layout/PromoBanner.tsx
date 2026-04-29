import Link from 'next/link'
import styles from './PromoBanner.module.scss'

export default function PromoBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.message}>
          <span className={styles.dot} aria-hidden="true" />
          <span>Consulta farmacéutica <strong>sin cargo</strong> · Retiro en sucursal <strong>el mismo día</strong></span>
        </div>
        <div className={styles.links}>
          <Link href="https://www.google.com/maps/place/Farmacia+Duret/@-34.4064716,-58.8588412,17z" target="_blank" rel="noopener noreferrer">
            Cómo llegar
          </Link>
          <span className={styles.sep} aria-hidden="true" />
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>
    </div>
  )
}
