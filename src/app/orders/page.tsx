'use client';

import { useState } from 'react';
import { TextLink } from '@/components/ui';
import PhoneInput from '@/components/ui/phone-input/phone-input';
import { PhoneSchema, REQUIRED_PHONE_MESSAGE } from '@/utils/phone';
import InfoPanel from './components/InfoPanel/InfoPanel';
import styles from './orders.module.scss';

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

async function submitOrder(fd: FormData): Promise<void> {
  const response = await fetch('/api/whatsapp/orders', {
    method: 'POST',
    body: fd,
  });
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.error || 'No pudimos enviar el encargo.');
  }
}

// ── Component ─────────────────────────────────────────────
export default function ReservasPage() {
  const [charCount, setCharCount] = useState(0);
  const [consent, setConsent] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submissionCount, setSubmissionCount] = useState(getCount);
  const [status, setStatus] = useState<Status>('idle');

  const remaining = MAX_PER_DAY - submissionCount;
  const isLimited = remaining <= 0;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLimited || !consent || status === 'submitting') {
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — silently accept
    if (fd.get('bot-field')) return;

    setErrorMessage('');
    setPhoneError('');

    const rawPhone = fd.get('phone');
    const phoneResult = PhoneSchema.safeParse(typeof rawPhone === 'string' ? rawPhone : '');

    if (!phoneResult.success) {
      setPhoneError(phoneResult.error.issues[0]?.message ?? REQUIRED_PHONE_MESSAGE);
      return;
    }

    setStatus('submitting');

    try {
      await submitOrder(fd);
      setSubmissionCount(incrementCount());
      setStatus('sent');
      form.reset();
      setCharCount(0);
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
    setPhoneError('');
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
              Recibimos tus datos. Te confirmamos disponibilidad, precio y horario de retiro por
              WhatsApp.
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

        <form className={styles.form} onSubmit={handleSubmit} aria-label="Contanos de vos">
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
                <PhoneInput hint="Te avisamos por WhatsApp." error={phoneError} />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email <span className={styles.optional}>(opcional)</span>
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
              Encargo
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
                required
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
              disabled={!consent || status === 'submitting'}
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
