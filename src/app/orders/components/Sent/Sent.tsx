import InfoPanel from '@/app/orders/components/InfoPanel/InfoPanel';
import styles from './Sent.module.scss';

export default function Sent() {
  return (
    <div className={styles.layout}>
      <InfoPanel />
      <section className={styles.formSide}>
        <div className={styles.sentBox}>
          <p className={styles.sentTitle}>Encargo enviado por WhatsApp</p>
          <p className={styles.sentText}>
            Recibimos tus datos y la imagen adjunta si la agregaste. Te confirmamos disponibilidad,
            precio y horario de retiro por WhatsApp.
          </p>
          {/* <button type="button" className={styles.btnPrimary} onClick={() => setStatus('idle')}>
            Hacer otro encargo
          </button> */}
        </div>
      </section>
    </div>
  );
}
