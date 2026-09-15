import styles from '@/app/(home)/home.module.scss';

const phone = '7894 2852';

export default function InfoStats() {
  return (
    <div className={styles.infoStats}>
      <div className={styles.infoStat}>
        <a
          href="https://www.google.com/maps/place/Farmacia+Duret/@-34.4064716,-58.8588412,17z/data=!3m1!4b1!4m6!3m5!1s0x95bc9dc88cd56f9d:0x2f17665d565396da!8m2!3d-34.4064761!4d-58.8562663!16s%2Fg%2F11xkrnpz6y?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.infoStatN}
        >
          Villa Rosa
        </a>
        <div className={styles.infoStatL}>E. Casella 1743 · Ver mapa</div>
      </div>

      <div className={styles.infoStat}>
        <div className={styles.infoStatN}>8–20 h</div>
        <div className={styles.infoStatL}>Lun–Sáb · Dom cerrado</div>
      </div>

      <div className={styles.infoStat}>
        <a href={`tel:+54911${phone}`} className={styles.infoStatN}>
          {phone}
        </a>
        <div className={styles.infoStatL}>Llamanos</div>
      </div>
    </div>
  );
}
