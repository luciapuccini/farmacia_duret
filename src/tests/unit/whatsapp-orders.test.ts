import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/whatsapp/orders/route'

function stubWhatsAppEnv() {
  vi.stubEnv('WHATSAPP_ACCESS_TOKEN', 'test-access-token')
  vi.stubEnv('WHATSAPP_GRAPH_API_VERSION', 'v25.0')
  vi.stubEnv('WHATSAPP_PHONE_NUMBER_ID', '123456789')
  vi.stubEnv('WHATSAPP_ORDER_RECIPIENT_PHONE_NUMBER', '+54 9 11 1111-2222')
  vi.stubEnv('WHATSAPP_ORDER_TEMPLATE_NAME', 'order_with_image')
  vi.stubEnv('WHATSAPP_ORDER_TEMPLATE_LANGUAGE', 'es_AR')
}

function orderFormData() {
  const formData = new FormData()
  formData.set('name', 'Juan Perez')
  formData.set('countryDial', '+54')
  formData.set('phone', '11 3333-4444')
  formData.set('email', 'juan@example.com')
  formData.set('notes', 'Necesito este producto')

  return formData
}

describe('WhatsApp order route', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('requires order send configuration', async () => {
    const response = await POST(
      new Request('https://farmaciaduret.online/api/whatsapp/orders', {
        method: 'POST',
        body: orderFormData(),
      }),
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'La integración de WhatsApp no está configurada.',
    })
  })

  it('uploads the image and sends it as the template header', async () => {
    stubWhatsAppEnv()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          id: 'media-id-123',
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          messages: [{ id: 'wamid.test' }],
        }),
      )
    vi.stubGlobal('fetch', fetchMock)

    const formData = orderFormData()
    formData.set(
      'image',
      new File(['image'], 'receta.png', { type: 'image/png' }),
    )

    const response = await POST(
      new Request('https://farmaciaduret.online/api/whatsapp/orders', {
        method: 'POST',
        body: formData,
      }),
    )

    await expect(response.json()).resolves.toEqual({
      ok: true,
      messageId: 'wamid.test',
      hasImage: true,
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)

    const [uploadUrl, uploadInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ]
    expect(uploadUrl).toBe(
      'https://graph.facebook.com/v25.0/123456789/media',
    )
    expect(uploadInit.method).toBe('POST')
    expect(uploadInit.headers).toEqual({
      Authorization: 'Bearer test-access-token',
    })
    expect(uploadInit.body).toBeInstanceOf(FormData)

    const [, messageInit] = fetchMock.mock.calls[1] as [string, RequestInit]
    const messageBody = JSON.parse(String(messageInit.body)) as {
      to: string
      template: {
        name: string
        language: { code: string }
        components: Array<{
          type: string
          parameters?: Array<{
            type: string
            image?: { id: string }
            text?: string
          }>
        }>
      }
    }

    expect(messageBody.to).toBe('5491111112222')
    expect(messageBody.template.name).toBe('order_with_image')
    expect(messageBody.template.language.code).toBe('es_AR')
    expect(messageBody.template.components[0]).toEqual({
      type: 'header',
      parameters: [
        {
          type: 'image',
          image: { id: 'media-id-123' },
        },
      ],
    })
    expect(messageBody.template.components[1]?.parameters).toEqual([
      { type: 'text', text: 'Juan Perez' },
      { type: 'text', text: '541133334444' },
      { type: 'text', text: 'juan@example.com' },
      { type: 'text', text: 'Necesito este producto' },
    ])
  })

  it('rejects unsupported image types before calling WhatsApp', async () => {
    stubWhatsAppEnv()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const formData = orderFormData()
    formData.set(
      'image',
      new File(['file'], 'receta.gif', { type: 'image/gif' }),
    )

    const response = await POST(
      new Request('https://farmaciaduret.online/api/whatsapp/orders', {
        method: 'POST',
        body: formData,
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'La imagen debe ser JPG, PNG o WebP.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
