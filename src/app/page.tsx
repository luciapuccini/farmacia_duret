import Link from "next/link";
import CatalogSection from "@/components/CatalogSection";
import HeroVisual from "@/components/HeroVisual";
import styles from "./home.module.scss";

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

				<div className={styles.heroVisual}>
					<HeroVisual />
				</div>
			</section>

			{/* ── Info strip ─────────────────────────────────────── */}
			<div className={styles.infoStrip}>
				<div className={styles.infoMsg}>
					<span className={styles.infoIcon} aria-hidden="true">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
					</span>
					<span>
						<b>Farmacia Duret</b> · Estamos en Villa Rosa,
						<br />
						Provincia de Buenos Aires
					</span>
				</div>

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
						<a href="tel:+541176231044" className={styles.infoStatN}>
							7623-1044
						</a>
						<div className={styles.infoStatL}>+54 11 · Llamanos</div>
					</div>
				</div>
			</div>

			{/* ── Categories ─────────────────────────────────────── */}
			<CatalogSection />
		</div>
	);
}
