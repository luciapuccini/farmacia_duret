import styles from '@/app/contact/contact.module.scss';

export default function ScheduleCard() {
  return (
    <div className={styles.scheduleCard}>
      <h3>
        <span className={styles.dotLive}></span>
        Horarios de atención
      </h3>
      <div className={styles.scheduleRow}>
        <span className={styles.day}>Lunes</span>
        <span className={styles.time}>8:00 – 20:00</span>
      </div>
      <div className={styles.scheduleRow}>
        <span className={styles.day}>Martes</span>
        <span className={styles.time}>8:00 – 20:00</span>
      </div>
      <div className={styles.scheduleRow}>
        <span className={styles.day}>Miércoles</span>
        <span className={styles.time}>8:00 – 20:00</span>
      </div>
      <div className={styles.scheduleRow}>
        <span className={styles.day}>Jueves</span>
        <span className={styles.time}>8:00 – 20:00</span>
      </div>
      <div className={styles.scheduleRow}>
        <span className={styles.day}>Viernes</span>
        <span className={styles.time}>8:00 – 20:00</span>
      </div>
      <div className={styles.scheduleRow}>
        <span className={styles.day}>Sábado</span>
        <span className={styles.time}>8:00 – 20:00</span>
      </div>
      <div className={`${styles.scheduleRow} ${styles.closed}`}>
        <span className={styles.day}>Domingo</span>
        <span className={styles.time}>Cerrado</span>
      </div>
    </div>
  );
}
