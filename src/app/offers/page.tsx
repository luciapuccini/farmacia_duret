import styles from "./offers.module.scss";

const creditOffers = [
	{
		id: 1,
		brand: "Tarjetas",
		headline: "Débito y crédito",
		detail: "Visa y Mastercard de los principales bancos",
	},
	{
		id: 4,
		brand: "Mercado Pago",
		headline: "Aceptamos Mercado Pago",
		detail: "Pagá con tu cuenta de Mercado Pago en sucursal",
	},
	{
		id: 5,
		brand: "Efectivo",
		headline: "Descuento en efectivo",
		detail: "Consultá el descuento especial abonando en efectivo",
	},
	{
		id: 6,
		brand: "Transferencia bancaria",
		headline: "Transferencia",
		detail: "Aceptamos transferencias bancarias al momento de la compra",
	},
];

export default function OfertasPage() {
	return (
		<section className={styles.container}>
			{/* Banner */}
			<div className={styles.banner}>
				<div className={styles.bannerContent}>
					<p className={styles.bannerEyebrow}>Promociones vigentes</p>
					<h2 className={styles.bannerHeadline}>Más salud, menos gasto</h2>
					<p className={styles.bannerSub}>
						Descubrí todas nuestras ofertas y medios de pago disponibles en
						Farmacia Duret. Actualizamos nuestras promociones regularmente para
						que siempre encuentres el mejor precio.
					</p>
				</div>
			</div>

			{/* Credit card offers */}
			<div className={styles.cardsSection}>
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
			</div>
		</section>
	);
}
