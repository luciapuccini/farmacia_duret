import styles from '@/app/dashboard/dashboard.module.scss';
import {
  formatMoney,
  fulfillmentLabel,
  selectedOrder,
  statusClass,
} from '@/app/dashboard/dashboard.data';

export default function OrderDetailPanel() {
  return (
    <aside className={styles.detailPanel} aria-label="Detalle del pedido">
      <div className={styles.detailHeader}>
        <h2>
          Detalle del pedido <span>#{selectedOrder.id}</span>
        </h2>
        <span className={statusClass(selectedOrder.status)}>{selectedOrder.status}</span>
      </div>

      <div className={styles.detailList}>
        <div>
          <span>Paciente</span>
          <strong>{selectedOrder.patient_name}</strong>
        </div>
        <div>
          <span>Contacto</span>
          <strong>{selectedOrder.patient_phone}</strong>
          <small>{selectedOrder.patient_email ?? 'Sin email'}</small>
        </div>
        <div>
          <span>Cobertura</span>
          <strong>{selectedOrder.coverage?.name ?? 'Particular'}</strong>
          <small>{selectedOrder.coverage_member_num ?? 'Sin número'}</small>
        </div>
        <div>
          <span>Tipo de entrega</span>
          <strong>{fulfillmentLabel(selectedOrder)}</strong>
        </div>
        <div>
          <span>Total de items</span>
          <strong>{selectedOrder.items.length} productos</strong>
        </div>
        <div>
          <span>Total estimado</span>
          <strong>{formatMoney(selectedOrder.total)}</strong>
        </div>
        <div>
          <span>Notas</span>
          <strong>{selectedOrder.notes}</strong>
        </div>
      </div>

      <div className={styles.transitions}>
        <h3>Transiciones permitidas</h3>
        <button type="button">
          delivery <small>Entregar a domicilio</small>
        </button>
        <button type="button">
          pickup_by_patient <small>Paciente retira en local</small>
        </button>
        <p>Cualquier transición no listada está prohibida.</p>
      </div>
    </aside>
  );
}
