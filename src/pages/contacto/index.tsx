import styles from './contacto.module.scss'

const hours = [
  { day: 'Lunes',      time: '8:00 – 20:00' },
  { day: 'Martes',     time: '8:00 – 20:00' },
  { day: 'Miércoles',  time: '8:00 – 20:00' },
  { day: 'Jueves',     time: '8:00 – 20:00' },
  { day: 'Viernes',    time: '8:00 – 20:00' },
  { day: 'Sábado',     time: '8:00 – 20:00' },
  { day: 'Domingo',    time: 'Cerrado' },
]

function ContactoPage() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Dirección</h2>
          <address className={styles.address}>
            <a
              href="https://www.google.com/maps/place/Farmacia+Duret/@-34.4064716,-58.8588412,17z/data=!3m1!4b1!4m6!3m5!1s0x95bc9dc88cd56f9d:0x2f17665d565396da!8m2!3d-34.4064761!4d-58.8562663!16s%2Fg%2F11xkrnpz6y?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.addressLink}
            >
              Pilar del Este, E. Casella 1743<br />
              B1631 Villa Rosa<br />
              Provincia de Buenos Aires, Argentina
            </a>
          </address>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Teléfono</h2>
          <a href="tel:+541176231044" className={styles.phone}>
            +54 11 7623-1044
          </a>
        </section>

        <section className={`${styles.card} ${styles.cardWide}`}>
          <h2 className={styles.cardTitle}>Horarios</h2>
          <ul className={styles.hoursList}>
            {hours.map(({ day, time }) => (
              <li key={day} className={styles.hoursItem}>
                <span>{day}</span>
                <span className={time === 'Cerrado' ? styles.closed : undefined}>
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default ContactoPage
