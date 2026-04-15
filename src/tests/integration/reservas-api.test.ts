import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import telegramSuccess from '../fixtures/telegram-success.json'

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn().mockReturnValue({
    env: {
      TELEGRAM_BOT_TOKEN: 'test-bot-token',
      TELEGRAM_CHAT_ID: '99999',
    },
  }),
}))

const { POST } = await import('@/app/api/reservas/route')

function makeRequest(fields: Record<string, string>, image?: File): Request {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value)
  }
  if (image) {
    formData.append('imagen', image, image.name)
  }
  return new Request('http://localhost/api/reservas', {
    method: 'POST',
    body: formData,
  })
}

const validFields = {
  name: 'Test User',
  email: 'test@example.com',
  telefono: '+54 11 1234-5678',
  encargo: 'Ibuprofeno 400mg',
}

describe('POST /api/reservas', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(telegramSuccess), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns { ok: true } on a successful text submission', async () => {
    const res = await POST(makeRequest(validFields))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
  })

  it('calls the Telegram sendMessage endpoint', async () => {
    await POST(makeRequest(validFields))
    expect(global.fetch).toHaveBeenCalledOnce()
    const [url] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string]
    expect(url).toContain('sendMessage')
    expect(url).toContain('test-bot-token')
  })

  it('includes name and encargo in the message body', async () => {
    await POST(makeRequest(validFields))
    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit,
    ]
    const body = JSON.parse(options.body as string) as {
      chat_id: string
      text: string
      parse_mode: string
    }
    expect(body.chat_id).toBe('99999')
    expect(body.text).toContain('Test User')
    expect(body.text).toContain('Ibuprofeno 400mg')
    expect(body.parse_mode).toBe('Markdown')
  })

  it('calls sendPhoto when an image is attached', async () => {
    const image = new File(['fake-image-bytes'], 'receta.jpg', { type: 'image/jpeg' })
    await POST(makeRequest(validFields, image))
    const [url] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string]
    expect(url).toContain('sendPhoto')
  })

  it('silently accepts and returns { ok: true } when honeypot is filled', async () => {
    const res = await POST(makeRequest({ ...validFields, 'bot-field': 'robot' }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 500 when Telegram credentials are missing', async () => {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    vi.mocked(getCloudflareContext).mockReturnValueOnce({
      env: { TELEGRAM_BOT_TOKEN: '', TELEGRAM_CHAT_ID: '' },
    } as ReturnType<typeof getCloudflareContext>)

    const res = await POST(makeRequest(validFields))
    expect(res.status).toBe(500)
  })
})
