import Link from 'next/link';
import { nameToSlug } from '@/utils/nameToSlug';
import {
  catalogCategories,
  instagram,
  navLinks,
  phone,
  whatsApp,
} from '@/components/ui/layout/footer/footer.data';
import styles from '@/components/ui/layout/footer/footer.module.scss';

export default function FooterGrid() {
  return (
    <div className={styles.grid}>
      <div className={styles.column}>
        <p className={styles.brand}>Farmacia Duret</p>
        <p className={styles.tagline}>Tu farmacia de confianza en Villa Rosa, Pilar del Este.</p>
      </div>

      <nav className={styles.column} aria-label="Navegación del sitio">
        <h2 className={styles.heading}>Navegación</h2>
        <ul className={styles.linkList}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={styles.link}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={styles.column} aria-label="Categorías del catálogo">
        <h2 className={styles.heading}>Catálogo</h2>
        <ul className={styles.linkList}>
          {catalogCategories.map((category) => (
            <li key={category.name}>
              <Link href={`/${nameToSlug(category.name)}`} className={styles.link}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.column}>
        <h2 className={styles.heading}>Contacto</h2>
        <address className={styles.contact}>
          <p>E. Casella 1743, B1631 Villa Rosa, Provincia de Buenos Aires</p>
          <p>
            <Link href={`tel:${phone}`} className={styles.link}>
              +54 11 7894 2852
            </Link>
          </p>
          <p>
            <Link href={whatsApp} className={styles.link} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </Link>
          </p>
          <p>
            <Link
              href={instagram}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              @farmacia_duret
            </Link>
          </p>
        </address>
      </div>
    </div>
  );
}
