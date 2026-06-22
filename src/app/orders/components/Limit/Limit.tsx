import InfoPanel from '@/app/orders/components/InfoPanel/InfoPanel';
import { TextLink } from '@/ui';
import styles from './limit.module.scss';

const MAX_PER_DAY = 6;
const PHONE = '+54 11 7894 2852';

export default function Limit() {
  return (
    <div className={styles.layout}>
      <InfoPanel />
      <section className={styles.formSide}>
        <div className={styles.limitBox}>
          <p className={styles.limitTitle}>Límite diario alcanzado</p>
          <p className={styles.limitText}>
            Podés enviar hasta {MAX_PER_DAY} encargos por día. Volvé mañana o comunicate con
            nosotros directamente por teléfono.
          </p>
          <TextLink href="tel:+541178942852" className={styles.limitPhone}>
            {PHONE}
          </TextLink>
        </div>
      </section>
    </div>
  );
}
