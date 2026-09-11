import Link from 'next/link';
import FooterGrid from '@/components/ui/layout/footer/components/FooterGrid/FooterGrid';
import { legalLinks } from '@/components/ui/layout/footer/footer.data';
import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <FooterGrid />

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
          <p>
            Desarrollado por{' '}
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
