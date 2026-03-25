import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { env } = getCloudflareContext()
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error('[notify-telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const formData = await request.formData()

  // Honeypot check — if filled, silently accept
  const botField = formData.get('bot-field')
  if (botField) {
    return NextResponse.json({ ok: true })
  }

  const name = (formData.get('name') as string) || 'Sin nombre'
  const email = (formData.get('email') as string) || 'Sin email'
  const encargo = (formData.get('encargo') as string) || '(sin detalle)'
  const imagen = formData.get('imagen') as File | null

  const lines = [
    '*Nuevo encargo recibido*',
    '',
    `👤 ${name}`,
    `📧 ${email}`,
    '',
    `📝 ${encargo}`,
  ]

  if (imagen && imagen.size > 0) {
    lines.push(`🖼 Imagen adjunta: ${imagen.name}`)
  }

  const date = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',
    timeStyle: 'short',
  })
  lines.push('', `_${date}_`)

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
    return NextResponse.json({ error: 'Telegram API error' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
