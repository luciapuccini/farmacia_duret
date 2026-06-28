import dashboardData from "@/services/catalog/data/dashboard-orders.json";
import type { Metadata } from "next";
import styles from "./dashboard.module.scss";

export const metadata: Metadata = {
	title: "Dashboard de órdenes | Farmacia Duret",
	robots: { index: false, follow: false },
};

type OrderStatus =
	| "created"
	| "confirmed_by_pharmacy"
	| "rejected_by_pharmacy"
	| "in_progress"
	| "ready_to_pick_up"
	| "delivery"
	| "pickup_by_patient"
	| "payment"
	| "closed";

type OrderItem = {
	id: string;
	product_name: string;
	quantity: number;
	unit_price: number;
	line_total: number;
	status: "pending" | "accepted" | "rejected";
};

type Order = {
	id: string;
	updated_at: string;
	status: OrderStatus;
	fulfillment_method: "pickup" | "delivery" | null;
	patient_name: string;
	patient_phone: string;
	patient_email: string | null;
	coverage: { id: string; name: string } | null;
	coverage_member_num: string | null;
	total: number;
	items: OrderItem[];
	notes: string;
};

const orders = dashboardData.orders as Order[];
const selectedOrder = orders[0];

const nextActions: Record<OrderStatus, string> = {
	created: "Confirmar",
	confirmed_by_pharmacy: "Preparar",
	rejected_by_pharmacy: "Ver motivo",
	in_progress: "Finalizar prep.",
	ready_to_pick_up: "Elegir entrega",
	delivery: "Marcar entrega",
	pickup_by_patient: "Marcar retiro",
	payment: "Cobrar",
	closed: "Ver detalle",
};

function countByStatus(status: OrderStatus) {
	return orders.filter((order) => order.status === status).length;
}

function formatDateTime(value: string) {
	return new Intl.DateTimeFormat("es-AR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));
}

function formatMoney(value: number) {
	return new Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: "ARS",
		maximumFractionDigits: 0,
	}).format(value);
}

function fulfillmentLabel(order: Order) {
	if (order.fulfillment_method === "delivery") return "Envío a domicilio";
	if (order.fulfillment_method === "pickup") return "Retiro en local";
	return "Sin definir";
}

function statusClass(status: OrderStatus) {
	return `${styles.status} ${styles[`status_${status}`]}`;
}

export default function DashboardPage() {
	const summary = [
		{ label: "Creadas", value: countByStatus("created"), status: "created" },
		{
			label: "En progreso",
			value:
				countByStatus("confirmed_by_pharmacy") + countByStatus("in_progress"),
			status: "in_progress",
		},
		{
			label: "Listas",
			value: countByStatus("ready_to_pick_up"),
			status: "ready_to_pick_up",
		},
		{
			label: "Pago pendiente",
			value: countByStatus("payment"),
			status: "payment",
		},
		{ label: "Cerradas", value: countByStatus("closed"), status: "closed" },
	] as const;

	return (
		<div className={styles.page}>
			<aside className={styles.sidebar} aria-label="Panel de administración">
				<div className={styles.brand}>
					<span className={styles.brandMark} aria-hidden="true">
						+
					</span>
					<div>
						<strong>Farmacia Duret</strong>
						<span>Panel de administración</span>
					</div>
				</div>

				<nav className={styles.nav} aria-label="Secciones del panel">
					<a href="#resumen">Resumen</a>
					<a className={styles.navActive} href="#ordenes">
						Órdenes
					</a>
					<a href="#pacientes">Pacientes</a>
					<a href="#catalogo">Catálogo</a>
					<a href="#inventario">Inventario</a>
					<a href="#mensajes">
						Mensajes <span>3</span>
					</a>
					<a href="#configuracion">Configuración</a>
				</nav>

				<div className={styles.helpBox}>
					<strong>¿Necesitás ayuda?</strong>
					<p>Nuestro equipo está listo para acompañarte en cada paso.</p>
					<button type="button">Contactar soporte</button>
				</div>
			</aside>

			<section className={styles.workspace}>
				<header className={styles.header}>
					<div>
						<h1>Órdenes de farmacia</h1>
						<p>Administrá recetas, preparación y estados de entrega.</p>
					</div>
					<button type="button" className={styles.exportButton}>
						Exportar
					</button>
				</header>

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

				<div className={styles.mainGrid}>
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
											className={
												order.id === selectedOrder.id
													? styles.selectedRow
													: undefined
											}
										>
											<td>
												<strong>{order.id}</strong>
											</td>
											<td>{order.patient_name}</td>
											<td>{fulfillmentLabel(order)}</td>
											<td>
												<span className={statusClass(order.status)}>
													{order.status}
												</span>
											</td>
											<td>{formatDateTime(order.updated_at)}</td>
											<td>
												<button
													type="button"
													className={styles.actionButton}
													data-status={order.status}
												>
													{nextActions[order.status]}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>

					<aside className={styles.detailPanel} aria-label="Detalle del pedido">
						<div className={styles.detailHeader}>
							<h2>
								Detalle del pedido <span>#{selectedOrder.id}</span>
							</h2>
							<span className={statusClass(selectedOrder.status)}>
								{selectedOrder.status}
							</span>
						</div>

						<div className={styles.detailList}>
							<div>
								<span>Paciente</span>
								<strong>{selectedOrder.patient_name}</strong>
							</div>
							<div>
								<span>Contacto</span>
								<strong>{selectedOrder.patient_phone}</strong>
								<small>{selectedOrder.patient_email ?? "Sin email"}</small>
							</div>
							<div>
								<span>Cobertura</span>
								<strong>{selectedOrder.coverage?.name ?? "Particular"}</strong>
								<small>
									{selectedOrder.coverage_member_num ?? "Sin número"}
								</small>
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
				</div>
			</section>
		</div>
	);
}
