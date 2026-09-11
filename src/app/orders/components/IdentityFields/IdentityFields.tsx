import ContactRow from '../ContactRow/ContactRow';

import styles from '@/app/orders/orders.module.scss';

export default function IdentityFields() {
  return (
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

      <ContactRow />
    </div>
  );
}
