interface NetlifyEvent {
  httpMethod: string
  body: string | null
}

interface HandlerResponse {
  statusCode: number
  body: string
}

interface NetlifyFormPayload {
  created_at?: string
  data?: Record<string, string>
  name?: string | null
  email?: string | null
}

interface WebhookBody {
  payload?: NetlifyFormPayload
  data?: Record<string, string>
  created_at?: string
  form_name?: string
  name?: string | null
  email?: string | null
}

export const handler = async (event: NetlifyEvent): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error('[notify-telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
    return { statusCode: 500, body: 'Server misconfigured' }
  }

  let parsed: WebhookBody
  try {
    parsed = JSON.parse(event.body ?? '')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON body' }
  }

  const x = parsed?.payload ?? parsed
  console.log('[notify-telegram] x:', JSON.stringify(x, null, 2))
  const name = x.name ?? 'Sin nombre'
  const email = x.email ?? 'Sin email'
  const data = x.data ?? {}
  const createdAt = x.created_at

  const lines = [
    '*Nuevo encargo recibido*',
    '',
    `👤 ${name}`,
    `📧 ${email}`,
    '',
    `📝 ${data.encargo ?? '(sin detalle)'}`,
  ]

  if (createdAt) {
    const date = new Date(createdAt).toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'short',
      timeStyle: 'short',
    })
    lines.push('', `_${date}_`)
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n'),
      parse_mode: 'Markdown',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[notify-telegram] Telegram API error:', err)
    return { statusCode: 502, body: 'Telegram API error' }
  }

  return { statusCode: 200, body: 'OK' }
}
