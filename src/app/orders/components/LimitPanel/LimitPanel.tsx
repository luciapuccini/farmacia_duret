import { TextLink } from '@/components/ui';
import { MAX_ORDERS_PER_DAY } from '@/utils/ordersRateLimit';

import InfoPanel from '../InfoPanel/InfoPanel';

import styles from '@/app/orders/orders.module.scss';

export default function LimitPanel() {
  return (
    <div className={styles.layout}>
      <InfoPanel />
      <section className={styles.formSide}>
        <div className={styles.limitBox}>
          <p className={styles.limitTitle}>Límite diario alcanzado</p>
          <p className={styles.limitText}>
            Podés enviar hasta {MAX_ORDERS_PER_DAY} encargos por día. Volvé mañana o comunicate con
            nosotros directamente por teléfono.
          </p>
          <TextLink href="tel:+541178942852" className={styles.limitPhone}>
            +54 11 7894 2852
          </TextLink>
        </div>
      </section>
    </div>
  );
}
