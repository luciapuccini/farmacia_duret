import Link from "next/link";
import styles from "./home.module.scss";

const mainCategories = [
	{ name: "Dermocosmética", slug: "dermocosmetica" },
	{ name: "Belleza", slug: "belleza" },
	{ name: "Cuidado Personal", slug: "cuidado-personal" },
	{ name: "Bebés", slug: "bebes" },
	{ name: "Hogar y Alimentos", slug: "hogar-y-alimentos" },
	{ name: "Salud y Farmacia", slug: "salud-y-farmacia" },
	{ name: "Medicamentos", slug: "medicamentos" },
];

export default function HomePage() {
	return (
		<div className={styles.page}>
			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<p className={styles.heroEyebrow}>
						<span className={styles.heroEyebrowDot} aria-hidden="true" />
						Farmacia Duret · Villa Rosa
					</p>
					<h1 className={styles.heroTitle}>
						Tu farmacia <em>de confianza</em>,<br />
						ahora online
					</h1>
					<p className={styles.heroSub}>
						Encontrá medicamentos, cuidado personal, productos para bebés y más.
						Encargá online y retirá en sucursal.
					</p>
					<div className={styles.heroCtas}>
						<Link href="/ofertas" className={styles.ctaPrimary}>
							Ver ofertas
						</Link>
						<Link href="/reservas" className={styles.ctaSecondary}>
							Hacer un encargo
						</Link>
					</div>

					<div className={styles.trustRow}>
						<div className={styles.trustItem}>
							<span className={styles.trustIcon}>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
								</svg>
							</span>
							<span className={styles.trustLabel}>
								<b>Productos auténticos</b>Habilitados por ANMAT
							</span>
						</div>
						<div className={styles.trustItem}>
							<span className={`${styles.trustIcon} ${styles.trustIconGreen}`}>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<circle cx="12" cy="12" r="10" />
									<path d="M12 6v6l4 2" />
								</svg>
							</span>
							<span className={styles.trustLabel}>
								<b>Retiro el mismo día</b>Lun–Sáb 8:00–20:00
							</span>
						</div>
						<div className={styles.trustItem}>
							<span className={styles.trustIcon}>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
								</svg>
							</span>
							<span className={styles.trustLabel}>
								<b>Asesoría farmacéutica</b>Sin cargo
							</span>
						</div>
					</div>
				</div>

				<div className={styles.heroVisual} aria-hidden="true">
					<div className={styles.heroPill}>
						<span>imagen · farmacia / productos</span>
					</div>

					<div className={`${styles.floatCard} ${styles.fc1}`}>
						<div className={styles.fcRow}>
							<div className={styles.fcThumb} />
							<div>
								<div className={styles.fcTitle}>Vitamina D3</div>
								<div className={styles.fcMeta}>60 cápsulas · $4.200</div>
							</div>
						</div>
						<div className={styles.fcBar}>
							<i style={{ width: "78%" }} />
						</div>
					</div>

					<div className={`${styles.floatCard} ${styles.fc3}`}>
						<div className={styles.fcRow}>
							<span className={styles.fcPill}>−25%</span>
							<div
								className={styles.fcMeta}
								style={{ fontWeight: 600, color: "var(--ink-900)" }}
							>
								Protección solar
							</div>
						</div>
					</div>

					<div className={`${styles.floatCard} ${styles.fc2}`}>
						<div className={styles.fcRow}>
							<div className={`${styles.fcThumb} ${styles.fcThumbGreen}`} />
							<div>
								<div className={styles.fcTitle}>Encargo listo en 2 h</div>
								<div className={styles.fcMeta}>Villa Rosa · retirá hoy</div>
							</div>
						</div>
					</div>
				</div>
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
						E. Casella 1743, B1631 Villa Rosa,
						<br />
						Provincia de Buenos Aires
					</a>
				</div>

				<div className={styles.infoCard}>
					<p className={styles.infoLabel}>Horarios</p>
					<p className={styles.infoValue}>
						Lun–Sáb &nbsp;8:00–20:00
						<br />
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
						<Link key={slug} href={`/${slug}`} className={styles.categoryCard}>
							{name}
						</Link>
					))}
					<Link
						href="/ofertas"
						className={`${styles.categoryCard} ${styles.categoryCardAccent}`}
					>
						Ofertas
					</Link>
				</div>
			</section>
		</div>
	);
}
