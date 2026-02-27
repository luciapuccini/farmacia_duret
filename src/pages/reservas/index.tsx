import { useState } from 'react'
import styles from './reservas.module.scss'

function ReservasPage() {
  const [charCount, setCharCount] = useState(0)

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.sub}>Hacé tus encargos online</p>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="encargo" className={styles.label}>
              Detalle del encargo
            </label>
            <textarea
              id="encargo"
              name="encargo"
              className={styles.textarea}
              placeholder="Escribí el nombre del producto, laboratorio, presentación o cualquier detalle que nos ayude a encontrarlo..."
              maxLength={300}
              rows={5}
              onChange={e => setCharCount(e.target.value.length)}
            />
            <span className={styles.charCount}>{charCount} / 300</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="imagen" className={styles.label}>
              Imagen de referencia <span className={styles.optional}>(opcional)</span>
            </label>
            <label htmlFor="imagen" className={styles.fileLabel}>
              <span className={styles.fileIcon}>↑</span>
              <span>Subir imagen</span>
              <span className={styles.fileHint}>PNG, JPG hasta 5 MB</span>
              <input
                id="imagen"
                name="imagen"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className={styles.fileInput}
              />
            </label>
          </div>

          <button type="submit" className={styles.submit}>
            Enviar encargo
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReservasPage
