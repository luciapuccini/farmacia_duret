import dashboardData from '@/services/catalog/data/dashboard-orders.json';
import styles from '@/app/dashboard/dashboard.module.scss';

export type OrderStatus =
  | 'created'
  | 'confirmed_by_pharmacy'
  | 'rejected_by_pharmacy'
  | 'in_progress'
  | 'ready_to_pick_up'
  | 'delivery'
  | 'pickup_by_patient'
  | 'payment'
  | 'closed';

export type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  status: 'pending' | 'accepted' | 'rejected';
};

export type Order = {
  id: string;
  updated_at: string;
  status: OrderStatus;
  fulfillment_method: 'pickup' | 'delivery' | null;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  coverage: { id: string; name: string } | null;
  coverage_member_num: string | null;
  total: number;
  items: OrderItem[];
  notes: string;
};

export const orders = dashboardData.orders as Order[];
export const selectedOrder = orders[0];

export const nextActions: Record<OrderStatus, string> = {
  created: 'Confirmar',
  confirmed_by_pharmacy: 'Preparar',
  rejected_by_pharmacy: 'Ver motivo',
  in_progress: 'Finalizar prep.',
  ready_to_pick_up: 'Elegir entrega',
  delivery: 'Marcar entrega',
  pickup_by_patient: 'Marcar retiro',
  payment: 'Cobrar',
  closed: 'Ver detalle',
};

export function countByStatus(status: OrderStatus) {
  return orders.filter((order) => order.status === status).length;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

export function fulfillmentLabel(order: Order) {
  if (order.fulfillment_method === 'delivery') return 'Envío a domicilio';
  if (order.fulfillment_method === 'pickup') return 'Retiro en local';
  return 'Sin definir';
}

export function statusClass(status: OrderStatus) {
  return `${styles.status} ${styles[`status_${status}`]}`;
}
