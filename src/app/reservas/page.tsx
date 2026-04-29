"use client";

import { useState, useEffect } from "react";
import styles from "./reservas.module.scss";
import Dropzone from "./components/Dropzone";
import InfoPanel from "./components/InfoPanel";

// ── Rate-limit helpers ────────────────────────────────────
const STORAGE_KEY = "reservas_submissions";
const MAX_PER_DAY = 6;

function todayKey() {
	return new Date().toISOString().slice(0, 10);
}

function getCount(): number {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return 0;
		const data = JSON.parse(raw) as { date: string; count: number };
		return data.date === todayKey() ? data.count : 0;
	} catch {
		return 0;
	}
}

function incrementCount(): number {
	const next = getCount() + 1;
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({ date: todayKey(), count: next }),
	);
	return next;
}

// ── Component ─────────────────────────────────────────────
type Status = "idle" | "submitting" | "success" | "error";

export default function ReservasPage() {
	const [charCount, setCharCount] = useState(0);
	const [files, setFiles] = useState<File[]>([]);
	const [consent, setConsent] = useState(true);
	const [folio, setFolio] = useState("");
	const [status, setStatus] = useState<Status>("idle");
	const [submissionCount, setSubmissionCount] = useState(0);

	useEffect(() => {
		setSubmissionCount(getCount());
	}, []);

	const remaining = MAX_PER_DAY - submissionCount;
	const isLimited = remaining <= 0;

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		if (status === "submitting" || isLimited || !consent) return;

		setStatus("submitting");
		const form = e.currentTarget;
		const fd = new FormData(form);

		// attach multi-file uploads under existing field name
		files.forEach((f) => { fd.append("imagen", f); });

		try {
			const response = await fetch("/api/reservas", {
				method: "POST",
				body: fd,
			});

			if (!response.ok) throw new Error("Server error");

			const newCount = incrementCount();
			setSubmissionCount(newCount);
			setFolio(`FD-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`);
			setStatus("success");
			form.reset();
			setCharCount(0);
			setFiles([]);
		} catch (err) {
			console.error("Error submitting form", err);
			setStatus("error");
		}
	}

	function resetForm() {
		setStatus("idle");
		setFiles([]);
		setCharCount(0);
	}

	// ── Limit reached ─────────────────────────────────────
	if (isLimited) {
		return (
			<div className={styles.layout}>
				<InfoPanel />
				<section className={styles.formSide}>
					<div className={styles.limitBox}>
						<p className={styles.limitTitle}>Límite diario alcanzado</p>
						<p className={styles.limitText}>
							Podés enviar hasta {MAX_PER_DAY} encargos por día. Volvé mañana o
							comunicate con nosotros directamente por teléfono.
						</p>
						<a href="tel:+541176231044" className={styles.limitPhone}>
							+54 11 7623-1044
						</a>
					</div>
				</section>
			</div>
		);
	}

	// ── Success ───────────────────────────────────────────
	if (status === "success") {
		return (
			<div className={styles.layout}>
				<InfoPanel />
				<section className={styles.formSide}>
					<div className={styles.successBox}>
						<span className={styles.successIcon}>
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</span>
						<h3 className={styles.successTitle}>¡Receta recibida!</h3>
						<p className={styles.successText}>
							Te escribimos por WhatsApp en menos de 30 minutos con la confirmación.
						</p>
						<span className={styles.folioTag}>
							Folio: <b>{folio}</b>
						</span>
						{remaining > 1 && (
							<button type="button" className={styles.btnPrimary} onClick={resetForm}>
								Hacer otro encargo
							</button>
						)}
					</div>
				</section>
			</div>
		);
	}

	// ── Form ──────────────────────────────────────────────
	return (
		<div className={styles.layout}>
			<InfoPanel />

			<section className={styles.formSide}>
				<div className={styles.formHead}>
					<h2 className={styles.formTitle}>Contanos de vos</h2>
					<p className={styles.formSub}>
						Solo necesitamos unos datos para avisarte cuando tu pedido esté listo.
					</p>
				</div>

				<form className={styles.form} onSubmit={handleSubmit} noValidate>
					{/* Honeypot */}
					<input
						name="bot-field"
						className={styles.hidden}
						aria-hidden="true"
						tabIndex={-1}
					/>

					{/* Group 1: Tus datos */}
					<div className={styles.group}>
						<div className={styles.groupTitle}>
							<span className={styles.num}>1</span>
							Tus datos
						</div>

						<div className={styles.field}>
							<label htmlFor="name" className={styles.label}>
								Nombre completo<span className={styles.req}>*</span>
							</label>
							<div className={styles.inputWrap}>
								<span className={styles.icon}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</span>
								<input
									id="name"
									name="name"
									type="text"
									className={styles.input}
									placeholder="Juan Pérez"
									required
								/>
							</div>
						</div>

						<div className={styles.row}>
							<div className={styles.field}>
								<label htmlFor="telefono" className={styles.label}>
									Teléfono<span className={styles.req}>*</span>
								</label>
								<div className={styles.phoneRow}>
									<span className={styles.phoneCc}>
										🇦🇷 +54
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
											<polyline points="6 9 12 15 18 9" />
										</svg>
									</span>
									<input
										id="telefono"
										name="telefono"
										type="tel"
										placeholder="11 1234-5678"
										required
									/>
								</div>
								<span className={styles.hint}>Te avisamos por WhatsApp.</span>
							</div>

							<div className={styles.field}>
								<label htmlFor="email" className={styles.label}>Email</label>
								<div className={styles.inputWrap}>
									<span className={styles.icon}>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
											<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
											<polyline points="22,6 12,13 2,6" />
										</svg>
									</span>
									<input
										id="email"
										name="email"
										type="email"
										className={styles.input}
										placeholder="vos@email.com"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Group 2: Tu receta */}
					<div className={styles.group}>
						<div className={styles.groupTitle}>
							<span className={styles.num}>2</span>
							Tu receta
						</div>
						<Dropzone files={files} onFilesChange={setFiles} />
					</div>

					{/* Group 3: Notas */}
					<div className={styles.group}>
						<div className={styles.groupTitle}>
							<span className={styles.num}>3</span>
							Notas <span className={styles.optional}>(opcional)</span>
						</div>
						<div className={styles.field}>
							<label htmlFor="encargo" className={styles.label}>
								Comentarios para el farmacéutico
							</label>
							<textarea
								id="encargo"
								name="encargo"
								className={styles.textarea}
								placeholder="Ej. necesito el genérico si está disponible, prefiero retirar mañana a la tarde…"
								maxLength={300}
								rows={4}
								onChange={(e) => setCharCount(e.target.value.length)}
							/>
							<span className={styles.charCount}>{charCount} / 300</span>
						</div>
					</div>

					{/* Consent */}
					<label className={styles.consent}>
						<input
							type="checkbox"
							checked={consent}
							onChange={(e) => setConsent(e.target.checked)}
						/>
						<span>
							Acepto el{" "}
							<a href="/privacidad" className={styles.consentLink}>aviso de privacidad</a>{" "}
							y autorizo el uso de mi receta para preparar mi pedido.
						</span>
					</label>

					{status === "error" && (
						<p className={styles.errorMsg}>
							Hubo un error al enviar. Por favor intentá de nuevo.
						</p>
					)}

					<div className={styles.actions}>
						<button type="button" className={styles.btnGhost} onClick={resetForm}>
							Cancelar
						</button>
						<button
							type="submit"
							className={styles.btnPrimary}
							disabled={status === "submitting" || !consent}
						>
							{status === "submitting" ? "Enviando…" : "Enviar receta"}
							{status !== "submitting" && (
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<path d="M5 12h14M13 5l7 7-7 7" />
								</svg>
							)}
						</button>
						<span className={styles.actionsMeta}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
							</svg>
							Conexión cifrada
						</span>
					</div>

					<span className={styles.remainingHint}>
						{remaining} de {MAX_PER_DAY} envíos disponibles hoy
					</span>
				</form>
			</section>
		</div>
	);
}
