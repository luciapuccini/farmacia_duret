import { describe, expect, it, vi, afterEach } from 'vitest'
import { GET, POST } from '@/app/api/whatsapp/webhook/route'

const VERIFY_TOKEN = 'test-verify-token'

describe('WhatsApp webhook route', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the Meta challenge when the verify token matches', async () => {
    vi.stubEnv('WHATSAPP_WEBHOOK_VERIFY_TOKEN', VERIFY_TOKEN)

    const response = await GET(
      new Request(
        `https://farmaciaduret.online/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${VERIFY_TOKEN}&hub.challenge=abc123`,
      ),
    )

    await expect(response.text()).resolves.toBe('abc123')
    expect(response.status).toBe(200)
  })

  it('rejects verification when the token does not match', async () => {
    vi.stubEnv('WHATSAPP_WEBHOOK_VERIFY_TOKEN', VERIFY_TOKEN)

    const response = await GET(
      new Request(
        'https://farmaciaduret.online/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123',
      ),
    )

    expect(response.status).toBe(403)
  })

  it('acknowledges valid webhook event payloads', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    const response = await POST(
      new Request('https://farmaciaduret.online/api/whatsapp/webhook', {
        method: 'POST',
        body: JSON.stringify({
          object: 'whatsapp_business_account',
          entry: [
            {
              changes: [
                {
                  field: 'messages',
                  value: {
                    metadata: { phone_number_id: '1134870129709445' },
                    messages: [{ id: 'wamid.test' }],
                  },
                },
              ],
            },
          ],
        }),
      }),
    )

    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(info).toHaveBeenCalledWith(
      '[whatsapp:webhook] event received',
      expect.objectContaining({
        object: 'whatsapp_business_account',
        fields: ['messages'],
        messageCount: 1,
        phoneNumberIds: ['1134870129709445'],
      }),
    )

    info.mockRestore()
  })
})
