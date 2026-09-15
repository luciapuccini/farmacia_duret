import styles from '@/app/dashboard/dashboard.module.scss';
import { countByStatus } from '@/app/dashboard/dashboard.data';

export default function SummaryGrid() {
  const summary = [
    { label: 'Creadas', value: countByStatus('created'), status: 'created' },
    {
      label: 'En progreso',
      value: countByStatus('confirmed_by_pharmacy') + countByStatus('in_progress'),
      status: 'in_progress',
    },
    {
      label: 'Listas',
      value: countByStatus('ready_to_pick_up'),
      status: 'ready_to_pick_up',
    },
    {
      label: 'Pago pendiente',
      value: countByStatus('payment'),
      status: 'payment',
    },
    { label: 'Cerradas', value: countByStatus('closed'), status: 'closed' },
  ] as const;

  return (
    <section className={styles.summaryGrid} aria-label="Resumen de órdenes">
      {summary.map((item) => (
        <article className={styles.summaryCard} key={item.label}>
          <span className={styles.summaryIcon} data-status={item.status}>
            {item.value}
          </span>
          <div>
            <p>{item.label}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
