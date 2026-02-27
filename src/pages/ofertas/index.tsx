import styles from './ofertas.module.scss'

const creditOffers = [
  {
    id: 1,
    brand: 'Visa / Mastercard',
    headline: '3 cuotas sin interés',
    detail: 'En todas las compras superiores a $5.000',
    badge: 'Todos los días',
  },
  {
    id: 2,
    brand: 'Naranja X',
    headline: 'Hasta 12 cuotas',
    detail: 'Con interés bancario vigente en productos seleccionados',
    badge: 'Todos los días',
  },
  {
    id: 3,
    brand: 'MODO / Pago QR',
    headline: '15% de descuento',
    detail: 'Pagando con billetera digital o código QR en sucursal',
    badge: 'Lunes y miércoles',
  },
]

function OfertasPage() {
  return (
    <section className={styles.container}>

      {/* Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p className={styles.bannerEyebrow}>Promociones vigentes</p>
          <h2 className={styles.bannerHeadline}>Más salud, menos gasto</h2>
          <p className={styles.bannerSub}>
            Descubrí todas nuestras ofertas y medios de pago disponibles en Farmacia Duret.
            Actualizamos nuestras promociones regularmente para que siempre encuentres el mejor precio.
          </p>
        </div>
      </div>

      {/* Credit card offers */}
      <div className={styles.cardsSection}>
        <h3 className={styles.sectionTitle}>Medios de pago y financiación</h3>
        <div className={styles.cardsGrid}>
          {creditOffers.map(({ id, brand, headline, detail, badge }) => (
            <div key={id} className={styles.card}>
              <span className={styles.cardBadge}>{badge}</span>
              <p className={styles.cardBrand}>{brand}</p>
              <p className={styles.cardHeadline}>{headline}</p>
              <p className={styles.cardDetail}>{detail}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default OfertasPage
