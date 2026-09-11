import { COUNTRY_CODES, DEFAULT_COUNTRY_DIAL } from '@/utils/countryCodes';

import styles from '@/app/orders/orders.module.scss';

export default function ContactRow() {
  return (
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
  );
}
