import { Link } from 'react-router'
import styles from './not-found.module.scss'

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.description}>
        La página que buscás no existe o fue movida a otra dirección.
      </p>
      <Link to="/" className={styles.link}>
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage
