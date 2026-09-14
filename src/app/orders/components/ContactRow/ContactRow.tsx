import PhoneInput from '@/components/ui/phone-input/phone-input';

import styles from '@/app/orders/orders.module.scss';

export default function ContactRow({ phoneError }: { phoneError: string }) {
  return (
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
  );
}
