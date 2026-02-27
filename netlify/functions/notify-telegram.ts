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
}

interface WebhookBody {
  payload?: NetlifyFormPayload
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

  console.log('[notify-telegram] Raw event body:', event.body)
  console.log('[notify-telegram] Parsed payload:', JSON.stringify(parsed, null, 2))

  const data = parsed?.payload?.data ?? {}
  console.log('[notify-telegram] Data object:', JSON.stringify(data, null, 2))
  console.log('[notify-telegram] Available keys in data:', Object.keys(data))

  const encargo = data.encargo ?? '(sin detalle)'
  console.log('[notify-telegram] Encargo value:', encargo)
  const createdAt = parsed?.payload?.created_at

  const lines = [
    '*Nuevo encargo recibido*',
    '',
    encargo,
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
