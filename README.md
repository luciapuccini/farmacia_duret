# Farmacia Duret

Sitio web de Farmacia Duret (Villa Rosa, Buenos Aires) — catálogo de productos, página de contacto y sistema de encargos online con notificaciones por Telegram.

## Stack

- **Vite + React + TypeScript** — frontend SPA
- **SCSS Modules** — estilos con scope por componente
- **Netlify** — hosting, formularios y funciones serverless

---

## Desarrollo local

```bash
npm install
npm run dev
```

## Notificaciones por Telegram

Cuando un cliente envía un encargo desde `/reservas`, el sistema notifica automáticamente a un grupo de Telegram. Los pasos a continuación explican cómo configurarlo.

### Paso 1 — Crear el bot
TBD

### Paso 2 — Crear el grupo de notificaciones

1. En Telegram, crear un nuevo grupo (ej. **"Encargos Farmacia Duret"**)
2. Agregar el bot al grupo (buscarlo por su nombre de usuario)
3. /start
4. Agregar a todos los integrantes del equipo que deban recibir las notificaciones.

### Paso 3 — Obtener el ID del grupo

1. Abrir este enlace en el navegador (reemplazar `{TOKEN}` con el token del Paso 1):
   ```
   https://api.telegram.org/bot{TOKEN}/getUpdates
   ```
2. Buscar en la respuesta un bloque como este:
   ```json
   "chat": { "id": -1001234567890, "title": "Encargos Farmacia Duret", "type": "group" }
   ```
3. El número después de `"id":` es el **Chat ID** — copiarlo (incluir el signo `-` si lo tiene)

### Paso 4 — Configurar las variables en Netlify

1. Ingresar al panel de Netlify → **Site configuration → Environment variables**
2. Hacer clic en **Add a variable** y agregar las siguientes dos:

   | Variable | Valor |
   |---|---|
   | `TELEGRAM_BOT_TOKEN` | El token del Paso 1 |
   | `TELEGRAM_CHAT_ID` | El ID del Paso 3 |

3. Guardar los cambios
4. Ir a **Deploys → Trigger deploy → Deploy site** para aplicar las variables

### Paso 5 — Activar el webhook en Netlify Forms

1. En Netlify → **Forms** → hacer clic en el formulario **reservas**
2. Ir a **Form notifications → Add notification → Outgoing webhook**
3. Completar los campos:
   - **Event to listen for:** `New form submission`
   - **URL to notify:** `https://{nombre-del-sitio}.netlify.app/.netlify/functions/notify-telegram`
     *(reemplazar `{nombre-del-sitio}` con el subdominio real del sitio en Netlify)*
4. Guardar

### Verificación

1. Abrir el sitio y enviar un encargo de prueba desde `/reservas`
2. En pocos segundos debe llegar un mensaje al grupo de Telegram con el texto del encargo
3. Si el mensaje no llega, revisar los logs en Netlify → **Functions → notify-telegram**

---


