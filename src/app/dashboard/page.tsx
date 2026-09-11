import type { Metadata } from 'next';
import OrderDetailPanel from '@/app/dashboard/components/OrderDetailPanel/OrderDetailPanel';
import OrdersPanel from '@/app/dashboard/components/OrdersPanel/OrdersPanel';
import Sidebar from '@/app/dashboard/components/Sidebar/Sidebar';
import SummaryGrid from '@/app/dashboard/components/SummaryGrid/SummaryGrid';
import styles from './dashboard.module.scss';

export const metadata: Metadata = {
  title: 'Dashboard de órdenes | Farmacia Duret',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <Sidebar />

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

        <SummaryGrid />

        <div className={styles.mainGrid}>
          <OrdersPanel />

          <OrderDetailPanel />
        </div>
      </section>
    </div>
  );
}
