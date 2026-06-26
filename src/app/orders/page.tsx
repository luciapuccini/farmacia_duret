'use client';

import { useState } from 'react';
import { TextLink } from '@/components/ui';
import { COUNTRY_CODES, DEFAULT_COUNTRY_DIAL } from '@/utils/countryCodes';
import InfoPanel from './components/InfoPanel/InfoPanel';
import styles from './orders.module.scss';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// ── Rate-limit helpers ────────────────────────────────────
const STORAGE_KEY = 'orders_submissions';
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), count: next }));
  return next;
}

type Status = 'idle' | 'submitting' | 'sent' | 'error';

// ── Component ─────────────────────────────────────────────
export default function ReservasPage() {
  const [charCount, setCharCount] = useState(0);
  const [consent, setConsent] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [submissionCount, setSubmissionCount] = useState(getCount);
  const [status, setStatus] = useState<Status>('idle');

  const remaining = MAX_PER_DAY - submissionCount;
  const isLimited = remaining <= 0;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0];
    setErrorMessage('');

    if (!image) {
      setFileName(null);
      setFileError('');
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
      e.target.value = '';
      setFileName(null);
      setFileError('La imagen debe ser JPG, PNG o WebP.');
      return;
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      e.target.value = '';
      setFileName(null);
      setFileError('La imagen debe pesar hasta 5 MB.');
      return;
    }

    setFileName(image.name);
    setFileError('');
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLimited || !consent || status === 'submitting') {
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — silently accept
    if (fd.get('bot-field')) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/whatsapp/orders', {
        method: 'POST',
        body: fd,
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error || 'No pudimos enviar el encargo.');
      }

      setSubmissionCount(incrementCount());
      setStatus('sent');
      form.reset();
      setCharCount(0);
      setFileName(null);
      setFileError('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'No pudimos enviar el encargo. Intentá de nuevo.',
      );
    }
  }

  function resetForm() {
    setCharCount(0);
    setErrorMessage('');
    setFileName(null);
    setFileError('');
    setStatus('idle');
  }

  if (status === 'sent') {
    return (
      <div className={styles.layout}>
        <InfoPanel />
        <section className={styles.formSide}>
          <div className={styles.sentBox}>
            <p className={styles.sentTitle}>Encargo enviado por WhatsApp</p>
            <p className={styles.sentText}>
              Recibimos tus datos y la imagen adjunta si la agregaste. Te confirmamos
              disponibilidad, precio y horario de retiro por WhatsApp.
            </p>
            <button type="button" className={styles.btnPrimary} onClick={() => setStatus('idle')}>
              Hacer otro encargo
            </button>
          </div>
        </section>
      </div>
    );
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
              Podés enviar hasta {MAX_PER_DAY} encargos por día. Volvé mañana o comunicate con
              nosotros directamente por teléfono.
            </p>
            <TextLink href="tel:+541178942852" className={styles.limitPhone}>
              +54 11 7894 2852
            </TextLink>
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

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Honeypot */}
          <input name="bot-field" className={styles.hidden} aria-hidden="true" tabIndex={-1} />

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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
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
                <label htmlFor="phone" className={styles.label}>
                  Teléfono<span className={styles.req}>*</span>
                </label>
                <div className={styles.phoneRow}>
                  <span className={styles.phoneCc}>
                    <select
                      name="countryDial"
                      aria-label="Código de país"
                      defaultValue={DEFAULT_COUNTRY_DIAL}
                      className={styles.phoneCcSelect}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.iso} value={c.dial}>
                          {c.flag} {c.dial}
                        </option>
                      ))}
                    </select>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                  <input id="phone" name="phone" type="tel" placeholder="11 1234-5678" required />
                </div>
                <span className={styles.hint}>Te avisamos por WhatsApp.</span>
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.icon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
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

          {/* Group 2: Notas */}
          <div className={styles.group}>
            <div className={styles.groupTitle}>
              <span className={styles.num}>2</span>
              Encargo <span className={styles.optional}>(opcional)</span>
            </div>
            <div className={styles.field}>
              <label htmlFor="notes" className={styles.label}>
                Comentarios para el farmacéutico
              </label>
              <textarea
                id="notes"
                name="notes"
                className={styles.textarea}
                placeholder="Ej. necesito el genérico si está disponible, prefiero retirar mañana a la tarde…"
                maxLength={300}
                rows={4}
                onChange={(e) => setCharCount(e.target.value.length)}
              />
              <span className={styles.charCount}>{charCount} / 300</span>
            </div>

            <div className={styles.field}>
              <label htmlFor="image" className={styles.label}>
                Imagen de referencia <span className={styles.optional}>(opcional)</span>
              </label>
              <label htmlFor="image" className={styles.fileLabel}>
                <span className={styles.fileIcon} aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </span>
                <span className={styles.fileName}>{fileName ?? 'Subir imagen'}</span>
                <span className={styles.fileHint}>JPG, PNG o WebP hasta 5 MB</span>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className={styles.fileInput}
                  onChange={handleImageChange}
                />
              </label>
              {fileError ? <span className={styles.fieldError}>{fileError}</span> : null}
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
              Acepto el{' '}
              <TextLink href="/privacidad" className={styles.consentLink}>
                aviso de privacidad
              </TextLink>{' '}
              y autorizo el uso de mi receta para preparar mi pedido.
            </span>
          </label>

          {status === 'error' ? <p className={styles.errorMsg}>{errorMessage}</p> : null}

          <div className={styles.actions}>
            <button type="button" className={styles.btnGhost} onClick={resetForm}>
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={!consent || status === 'submitting' || Boolean(fileError)}
            >
              {status === 'submitting' ? 'Enviando...' : 'Enviar por WhatsApp'}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <span className={styles.remainingHint}>
            {remaining} de {MAX_PER_DAY} envíos disponibles hoy
          </span>
        </form>
      </section>
    </div>
  );
}
