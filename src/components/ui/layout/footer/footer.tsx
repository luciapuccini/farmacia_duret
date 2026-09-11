import Link from 'next/link';
import categories from '@/services/catalog/data/categories.json';
import type { TCategory } from '@/types/types';
import { nameToSlug } from '@/utils/nameToSlug';
import styles from './footer.module.scss';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/offers', label: 'Ofertas' },
  { href: '/orders', label: 'Encargos' },
  { href: '/contact', label: 'Contacto' },
];

const legalLinks = [{ href: '/privacy', label: 'Política de privacidad' }];

const catalogCategories = (categories as TCategory[]).filter(
  (category) => category.subcategories?.length,
);

const phone = '+541178942852';
const instagram = 'https://www.instagram.com/farmacia_duret';
const whatsApp = 'https://wa.me/5491178942852';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <p className={styles.brand}>Farmacia Duret</p>
            <p className={styles.tagline}>
              Tu farmacia de confianza en Villa Rosa, Pilar del Este.
            </p>
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
                <Link
                  href={whatsApp}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

        <div className={styles.legal}>
          <nav aria-label="Legal">
            <ul className={styles.legalLinks}>
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>
            Para consultas y/o denuncias contactar a la Dirección General de Defensa y Protección al
            Consumidor
          </p>
          <p>
            © Copyright 2026. Todos los derechos reservados | Farmacia Duret, E. Casella 1743, B1631
            Villa Rosa, Provincia de Buenos Aires, Argentina.
          </p>
          <p>
            Las fotos son a modo ilustrativo. La venta de cualquiera de los productos publicados
            está sujeta a la verificación de stock.
          </p>
          <p className="text-end">
            Desarrollado por &nbsp;
            <Link
              href="https://luciapuccini.com"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              luciapuccini
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
