'use client';

import styles from '@/app/orders/orders.module.scss';

type Props = {
  charCount: number;
  setCharCount: (value: number) => void;
};

export default function NotesField({ charCount, setCharCount }: Props) {
  return (
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
  );
}
