import styles from './footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>Para consultas y/o denuncias contactar a la Dirección General de Defensa y Protección al Consumidor</p>
        <p>© Copyright 2026. Todos los derechos reservados | Farmacia Duret, E. Casella 1743, B1631 Villa Rosa, Provincia de Buenos Aires, Argentina.</p>
        <p>Las fotos son a modo ilustrativo. La venta de cualquiera de los productos publicados está sujeta a la verificación de stock.</p>
      </div>
    </footer>
  )
}
