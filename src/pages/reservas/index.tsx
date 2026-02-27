import { useState } from 'react'
import styles from './reservas.module.scss'

type Status = 'idle' | 'submitting' | 'success' | 'error'

function ReservasPage() {
  const [charCount, setCharCount] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    const form = e.currentTarget

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: new FormData(form),
      })

      if (!response.ok) throw new Error('Server error')

      setStatus('success')
      form.reset()
      setCharCount(0)
      setFileName(null)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successBox}>
            <p className={styles.successTitle}>¡Encargo recibido!</p>
            <p className={styles.successText}>
              Te contactaremos a la brevedad para confirmar la disponibilidad.
            </p>
            <button className={styles.submit} onClick={() => setStatus('idle')}>
              Hacer otro encargo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.sub}>Hacé tus encargos online</p>

        <form
          name="reservas"
          method="POST"
          encType="multipart/form-data"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          {/* Required hidden fields for Netlify */}
          <input type="hidden" name="form-name" value="reservas" />
          <input name="bot-field" className={styles.hidden} aria-hidden="true" tabIndex={-1} />

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
              required
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
              <span>{fileName ?? 'Subir imagen'}</span>
              <span className={styles.fileHint}>PNG, JPG hasta 5 MB</span>
              <input
                id="imagen"
                name="imagen"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className={styles.fileInput}
                onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </div>

          {status === 'error' && (
            <p className={styles.errorMsg}>
              Hubo un error al enviar el encargo. Por favor intentá de nuevo.
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Enviando...' : 'Enviar encargo'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReservasPage
