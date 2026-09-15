import styles from '@/app/dashboard/dashboard.module.scss';
import {
  formatDateTime,
  fulfillmentLabel,
  nextActions,
  orders,
  selectedOrder,
  statusClass,
} from '@/app/dashboard/dashboard.data';

export default function OrdersPanel() {
  return (
    <section className={styles.panel} id="ordenes">
      <div className={styles.panelHeader}>
        <div>
          <h2>Órdenes recientes</h2>
          <p>Mostrando {orders.length} órdenes.</p>
        </div>
        <div className={styles.tableTools}>
          <input
            type="search"
            placeholder="Buscar pedido, paciente..."
            aria-label="Buscar pedido"
          />
          <button type="button">Filtros</button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Paciente</th>
              <th>Entrega</th>
              <th>Estado actual</th>
              <th>Actualización</th>
              <th>Próxima acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={order.id === selectedOrder.id ? styles.selectedRow : undefined}
              >
                <td>
                  <strong>{order.id}</strong>
                </td>
                <td>{order.patient_name}</td>
                <td>{fulfillmentLabel(order)}</td>
                <td>
                  <span className={statusClass(order.status)}>{order.status}</span>
                </td>
                <td>{formatDateTime(order.updated_at)}</td>
                <td>
                  <button type="button" className={styles.actionButton} data-status={order.status}>
                    {nextActions[order.status]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
