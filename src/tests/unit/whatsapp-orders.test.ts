import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/whatsapp/orders/route';

function stubWhatsAppEnv() {
  vi.stubEnv('WHATSAPP_ACCESS_TOKEN', 'test-access-token');
  vi.stubEnv('WHATSAPP_GRAPH_API_VERSION', 'v25.0');
  vi.stubEnv('WHATSAPP_PHONE_NUMBER_ID', '123456789');
  vi.stubEnv('WHATSAPP_ORDER_RECIPIENT_PHONE_NUMBER', '+54 9 11 1111-2222');
  vi.stubEnv('WHATSAPP_ORDER_TEMPLATE_NAME', 'pedido_imagen');
  vi.stubEnv('WHATSAPP_ORDER_TEMPLATE_LANGUAGE', 'es_AR');
}

function orderFormData() {
  const formData = new FormData();
  formData.set('name', 'Juan Perez');
  formData.set('countryDial', '+54');
  formData.set('phone', '11 3333-4444');
  formData.set('email', 'juan@example.com');
  formData.set('notes', 'Necesito este producto');

  return formData;
}

function stubGraphSuccess() {
  const fetchMock = vi.fn().mockResolvedValue(
    Response.json({
      messages: [{ id: 'wamid.test' }],
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('WhatsApp order route', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('requires order send configuration', async () => {
    const response = await POST(
      new Request('https://farmaciaduret.online/api/whatsapp/orders', {
        method: 'POST',
        body: orderFormData(),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'La integración de WhatsApp no está configurada.',
    });
  });

  it('sends the order template with submitted customer data', async () => {
    stubWhatsAppEnv();
    const fetchMock = stubGraphSuccess();

    const formData = orderFormData();

    const response = await POST(
      new Request('https://farmaciaduret.online/api/whatsapp/orders', {
        method: 'POST',
        body: formData,
      }),
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      messageId: 'wamid.test',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [messageUrl, messageInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(messageUrl).toBe('https://graph.facebook.com/v25.0/123456789/messages');
    expect(messageInit.method).toBe('POST');
    expect(messageInit.headers).toEqual({
      Authorization: 'Bearer test-access-token',
      'Content-Type': 'application/json',
    });

    const messageBody = JSON.parse(String(messageInit.body)) as {
      to: string;
      template: {
        name: string;
        language: { code: string };
        components: Array<{
          type: string;
          parameters?: Array<{
            type: string;
            parameter_name?: string;
            text?: string;
          }>;
        }>;
      };
    };

    expect(messageBody.to).toBe('541133334444');
    expect(messageBody.template.name).toBe('pedido_imagen');
    expect(messageBody.template.language.code).toBe('es_AR');
    expect(messageBody.template.components[0]).toEqual({
      type: 'body',
      parameters: [
        { type: 'text', parameter_name: 'name', text: 'Juan Perez' },
        { type: 'text', parameter_name: 'phone', text: '541133334444' },
        { type: 'text', parameter_name: 'email', text: 'juan@example.com' },
        { type: 'text', parameter_name: 'notes', text: 'Necesito este producto' },
      ],
    });
  });
});
