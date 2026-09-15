'use client';

import InfoPanel from '../InfoPanel/InfoPanel';

import styles from '@/app/orders/orders.module.scss';

export default function SentPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className={styles.layout}>
      <InfoPanel />
      <section className={styles.formSide}>
        <div className={styles.sentBox}>
          <p className={styles.sentTitle}>Encargo enviado por WhatsApp</p>
          <p className={styles.sentText}>
            Recibimos tus datos. Te confirmamos disponibilidad, precio y horario de retiro por
            WhatsApp.
          </p>
          <button type="button" className={styles.btnPrimary} onClick={onReset}>
            Hacer otro encargo
          </button>
        </div>
      </section>
    </div>
  );
}
