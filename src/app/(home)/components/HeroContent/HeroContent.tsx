import { TextLink } from '@/components/ui';
import TrustRow from '@/app/(home)/components/TrustRow/TrustRow';
import styles from '@/app/(home)/home.module.scss';

export default function HeroContent() {
  return (
    <div className={styles.heroContent}>
      {/* FIXME: could extract eyebrow to a separate component */}
      <p className={styles.heroEyebrow}>
        <span className={styles.heroEyebrowDot} aria-hidden="true" />
        Farmacia Duret · Villa Rosa
      </p>
      <h1 className={styles.heroTitle}>
        Tu farmacia <em>de confianza</em>,<br />
        ahora online
      </h1>
      <p className={styles.heroSub}>
        Encontrá medicamentos, cuidado personal, productos para bebés y más. Encargá online y retirá
        en sucursal.
      </p>
      <div className={styles.heroCtas}>
        <TextLink href="/offers" variant="secondary">
          Ver ofertas
        </TextLink>

        <TextLink href="/orders" variant="primary">
          Hacer un encargo
        </TextLink>
      </div>

      <TrustRow />
    </div>
  );
}
