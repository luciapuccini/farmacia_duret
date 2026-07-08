import type { ChangeEvent, JSX } from 'react';

import { ARGENTINA_DIAL_CODE } from '@/utils/phone';

import styles from './phone-input.module.scss';

interface PhoneInputProps {
  hint?: string;
  error?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PhoneInput({ hint, error, value, onChange }: PhoneInputProps): JSX.Element {
  return (
    <>
      <label htmlFor="phone" className={styles.label}>
        Teléfono<span className={styles.req}>*</span>
      </label>
      <div className={styles.phoneRow}>
        <span className={styles.phoneCc}>
          🇦🇷 {ARGENTINA_DIAL_CODE}
          <input type="hidden" name="countryDial" value={ARGENTINA_DIAL_CODE} />
        </span>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="11 1234-5678"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'phone-error' : undefined}
          {...(value !== undefined ? { value, onChange } : {})}
        />
      </div>
      {error ? (
        <span id="phone-error" role="alert" className={styles.error}>
          {error}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </>
  );
}
