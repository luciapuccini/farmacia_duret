import Image from "next/image";

const AVATARS = [
	{ bg: "var(--bg-blue)",  fg: "var(--blue-600)",  letter: "M" },
	{ bg: "var(--bg-mint)",  fg: "var(--green-700)", letter: "A" },
	{ bg: "var(--blue-100)", fg: "var(--blue-700)",  letter: "C" },
];

export default function HeroVisual() {
	return (
		<div style={{ position: "relative", aspectRatio: "1.05 / 1" }}>

			{/* ── Photo ─────────────────────────────────────────── */}
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					overflow: "hidden",
					borderRadius: "var(--radius-xl)",
					border: "1px solid var(--line)",
					boxShadow: "var(--shadow-lg)",
				}}
			>
				<Image
					src="/images/hero-pharmacy.jpg"
					alt="Farmacéutica atendiendo a una madre con su hijo en la farmacia"
					fill
					priority
					style={{ objectFit: "cover", objectPosition: "top" }}
					sizes="(max-width: 980px) 100vw, 50vw"
				/>
				<div
					aria-hidden="true"
					style={{
						position: "absolute",
						inset: 0,
						pointerEvents: "none",
						background:
							"linear-gradient(to top, oklch(0.15 0.03 235 / 0.28) 0%, transparent 50%)",
					}}
				/>
			</div>

			{/* ── Card: Atención personalizada (top-left) ─────────── */}
			<div
				style={{
					position: "absolute",
					top: "7%",
					left: "5%",
					display: "flex",
					alignItems: "center",
					gap: 12,
					background: "white",
					border: "1px solid var(--line)",
					borderRadius: "var(--radius)",
					boxShadow: "var(--shadow)",
					padding: "12px 16px",
					minWidth: 196,
				}}
			>
				<div
					aria-hidden="true"
					style={{
						flexShrink: 0,
						display: "grid",
						placeItems: "center",
						width: 38,
						height: 38,
						borderRadius: 10,
						background: "var(--bg-mint)",
					}}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="var(--green-700)"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</div>
				<div>
					<p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-900)", margin: 0 }}>
						Atención personalizada
					</p>
					<p style={{ fontSize: 12, color: "var(--ink-500)", margin: "2px 0 0" }}>
						Farmacéuticos certificados
					</p>
				</div>
			</div>

			{/* ── Card: Clientes (bottom-right) ───────────────────── */}
			<div
				style={{
					position: "absolute",
					bottom: "8%",
					right: "5%",
					background: "white",
					border: "1px solid var(--line)",
					borderRadius: "var(--radius)",
					boxShadow: "var(--shadow)",
					padding: "14px 18px",
					minWidth: 206,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
					<div style={{ display: "flex" }}>
						{AVATARS.map(({ bg, fg, letter }, i) => (
							<div
								key={letter}
								aria-hidden="true"
								style={{
									display: "grid",
									placeItems: "center",
									width: 28,
									height: 28,
									borderRadius: "50%",
									background: bg,
									border: "2px solid white",
									fontSize: 11,
									fontWeight: 700,
									color: fg,
									marginLeft: i > 0 ? -8 : 0,
								}}
							>
								{letter}
							</div>
						))}
					</div>
					<div style={{ display: "flex", gap: 2 }} aria-hidden="true">
						{Array.from({ length: 5 }).map((_, i) => (
							<svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--green-500)">
								<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
							</svg>
						))}
					</div>
				</div>
				<p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-900)", margin: 0 }}>
					+4.800 clientes felices
				</p>
				<p style={{ fontSize: 12, color: "var(--ink-500)", margin: "2px 0 0" }}>
					Valoración media de 4.9 / 5
				</p>
			</div>

			{/* ── Badge: Retirá mismo día (top-right) ─────────────── */}
			<div
				style={{
					position: "absolute",
					top: "7%",
					right: "5%",
					display: "flex",
					alignItems: "center",
					gap: 8,
					background: "var(--bg-mint)",
					border: "1px solid oklch(0.74 0.12 165 / 0.3)",
					borderRadius: "var(--radius-pill)",
					boxShadow: "var(--shadow-sm)",
					padding: "7px 14px",
				}}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="var(--green-700)"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M12 6v6l4 2" />
				</svg>
				<span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--green-700)" }}>
					Retirá mismo día
				</span>
			</div>

		</div>
	);
}
