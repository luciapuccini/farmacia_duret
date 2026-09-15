import styles from '@/app/dashboard/dashboard.module.scss';

export default function Sidebar() {
  return (
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
  );
}
