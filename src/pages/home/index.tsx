import { Link } from 'react-router'
import styles from './home.module.scss'

const mainCategories = [
  { name: 'Dermocosmética',    slug: 'dermocosmetica' },
  { name: 'Belleza',           slug: 'belleza' },
  { name: 'Cuidado Personal',  slug: 'cuidado-personal' },
  { name: 'Bebés',             slug: 'bebes' },
  { name: 'Hogar y Alimentos', slug: 'hogar-y-alimentos' },
  { name: 'Salud y Farmacia',  slug: 'salud-y-farmacia' },
  { name: 'Medicamentos',      slug: 'medicamentos' },
]

function HomePage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Farmacia Duret · Villa Rosa</p>
          <h1 className={styles.heroTitle}>
            Tu farmacia de<br />confianza, ahora online
          </h1>
          <p className={styles.heroSub}>
            Encontrá medicamentos, cuidado personal, productos para bebés y más.
            Encargá online y retirá en sucursal.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/ofertas" className={styles.ctaPrimary}>
              Ver ofertas
            </Link>
            <Link to="/reservas" className={styles.ctaSecondary}>
              Hacer un encargo
            </Link>
          </div>
        </div>
        <div className={styles.heroDecor} aria-hidden="true" />
      </section>

      {/* ── Info strip ─────────────────────────────────────── */}
      <section className={styles.infoStrip}>
        <div className={styles.infoCard}>
          <p className={styles.infoLabel}>Dirección</p>
          <a
            href="https://www.google.com/maps/place/Farmacia+Duret/@-34.4064716,-58.8588412,17z/data=!3m1!4b1!4m6!3m5!1s0x95bc9dc88cd56f9d:0x2f17665d565396da!8m2!3d-34.4064761!4d-58.8562663!16s%2Fg%2F11xkrnpz6y?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoLink}
          >
            E. Casella 1743, B1631 Villa Rosa,<br />Provincia de Buenos Aires
          </a>
        </div>

        <div className={styles.infoCard}>
          <p className={styles.infoLabel}>Horarios</p>
          <p className={styles.infoValue}>
            Lun–Sáb &nbsp;8:00–20:00<br />
            <span className={styles.infoClosed}>Domingo cerrado</span>
          </p>
        </div>

        <div className={styles.infoCard}>
          <p className={styles.infoLabel}>Teléfono</p>
          <a href="tel:+541176231044" className={styles.infoLink}>
            +54 11 7623-1044
          </a>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────── */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Navegá por categoría</h2>
        <div className={styles.categoryGrid}>
          {mainCategories.map(({ name, slug }) => (
            <Link key={slug} to={`/${slug}`} className={styles.categoryCard}>
              {name}
            </Link>
          ))}
          <Link to="/ofertas" className={`${styles.categoryCard} ${styles.categoryCardAccent}`}>
            Ofertas
          </Link>
        </div>
      </section>

    </div>
  )
}

export default HomePage
