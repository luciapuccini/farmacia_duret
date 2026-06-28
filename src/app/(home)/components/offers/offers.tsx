import styles from './offers.module.scss';

const creditOffers = [
  {
    id: 1,
    brand: 'Tarjetas',
    headline: 'Débito y crédito',
    detail: 'Visa y Mastercard de los principales bancos',
  },
  {
    id: 2,
    brand: 'Mercado Pago',
    headline: 'Aceptamos Mercado Pago',
    detail: 'Pagá con tu cuenta de Mercado Pago en sucursal',
  },
  {
    id: 3,
    brand: 'Efectivo',
    headline: 'Descuento en efectivo',
    detail: 'Consultá el descuento especial abonando en efectivo',
  },
  {
    id: 4,
    brand: 'Transferencia bancaria',
    headline: 'Transferencia',
    detail: 'Aceptamos transferencias bancarias al momento de la compra',
  },
];

export default function Offers() {
  return (
    <section className={styles.cardsSection}>
      <h3 className={styles.sectionTitle}>Medios de pago y financiación</h3>
      <div className={styles.cardsGrid}>
        {creditOffers.map(({ id, brand, headline, detail }) => (
          <div key={id} className={styles.card}>
            <p className={styles.cardBrand}>{brand}</p>
            <p className={styles.cardHeadline}>{headline}</p>
            <p className={styles.cardDetail}>{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
