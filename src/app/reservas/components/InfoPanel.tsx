import styles from "./InfoPanel.module.scss";

const steps = [
	{
		n: 1,
		title: "Comparte tu receta",
		desc: "Llena el formulario con tu foto o PDF.",
		done: true,
	},
	{
		n: 2,
		title: "Te confirmamos en 30 min",
		desc: "Disponibilidad, precio total y tiempo de preparación.",
		done: false,
	},
	{
		n: 3,
		title: "Retirás en sucursal",
		desc: "Sin filas, con tu receta original e identificación.",
		done: false,
	},
];

export default function InfoPanel() {
	return (
		<aside className={styles.side}>
			<span className={styles.eyebrow}>
				<span className={styles.dot} />
				Reservas · Sube tu receta
			</span>

			<h2 className={styles.heading}>
				Tu receta lista en{" "}
				<em className={styles.accent}>30 minutos</em>.
			</h2>

			<p className={styles.lede}>
				Subí una foto o PDF de tu receta médica y nuestro farmacéutico
				te confirma disponibilidad, precio y horario de retiro por WhatsApp.
			</p>

			<div className={styles.steps}>
				{steps.map((s) => (
					<div key={s.n} className={`${styles.step} ${s.done ? styles.done : ""}`}>
						<span className={styles.stepN}>{s.n}</span>
						<div className={styles.stepBody}>
							<b>{s.title}</b>
							<span>{s.desc}</span>
						</div>
					</div>
				))}
			</div>

			<div className={styles.foot}>
				<div className={styles.footRow}>
					<span className={styles.footIcon}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						</svg>
					</span>
					<span>
						<b>Tu información está segura</b>
						Ciframos tus datos y recetas.
					</span>
				</div>

				<div className={styles.footRow}>
					<span className={styles.footIcon}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
						</svg>
					</span>
					<span>
						<b>¿Preferís llamar?</b>
						<a href="tel:+541176231044" className={styles.phone}>+54 11 7623-1044</a>
					</span>
				</div>

				<div className={styles.disclaimer}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<span>
						Por regulación sanitaria, los productos con receta deben retirarse{" "}
						<b>personalmente en sucursal</b> presentando la receta original e
						identificación oficial.
					</span>
				</div>
			</div>
		</aside>
	);
}
