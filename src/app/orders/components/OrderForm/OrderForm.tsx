'use client';

import type { SyntheticEvent } from 'react';
import { TextLink } from '@/components/ui';
import { MAX_ORDERS_PER_DAY } from '@/utils/ordersRateLimit';

import IdentityFields from '../IdentityFields/IdentityFields';
import InfoPanel from '../InfoPanel/InfoPanel';
import NotesField from '../NotesField/NotesField';

import styles from '@/app/orders/orders.module.scss';

export type Status = 'idle' | 'submitting' | 'sent' | 'error';

type Props = {
  charCount: number;
  consent: boolean;
  errorMessage: string;
  onReset: () => void;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  remaining: number;
  setCharCount: (value: number) => void;
  setConsent: (value: boolean) => void;
  status: Status;
};

export default function OrderForm({
  charCount,
  consent,
  errorMessage,
  onReset,
  onSubmit,
  remaining,
  setCharCount,
  setConsent,
  status,
}: Props) {
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

        <form className={styles.form} onSubmit={onSubmit}>
          {/* Honeypot */}
          <input name="bot-field" className={styles.hidden} aria-hidden="true" tabIndex={-1} />

          <IdentityFields />

          <NotesField charCount={charCount} setCharCount={setCharCount} />

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
            <button type="button" className={styles.btnGhost} onClick={onReset}>
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
            {remaining} de {MAX_ORDERS_PER_DAY} envíos disponibles hoy
          </span>
        </form>
      </section>
    </div>
  );
}
