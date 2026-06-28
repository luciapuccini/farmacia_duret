import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/whatsapp/catalogo/route';
import { CatalogoOrderSchema } from '@/app/api/whatsapp/catalogo/schema';

function stubWhatsAppEnv() {
  vi.stubEnv('WHATSAPP_ACCESS_TOKEN', 'test-access-token');
  vi.stubEnv('WHATSAPP_GRAPH_API_VERSION', 'v25.0');
  vi.stubEnv('WHATSAPP_PHONE_NUMBER_ID', '123456789');
  vi.stubEnv('WHATSAPP_CATALOGO_TEMPLATE_NAME', 'pedido_catalogo');
  vi.stubEnv('WHATSAPP_TEMPLATE_LANGUAGE', 'es_AR');
}

function catalogoRequest(body: unknown) {
  return new Request('https://farmaciaduret.online/api/whatsapp/catalogo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
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

describe('WhatsApp catalogo route', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('requires catalogo template configuration', async () => {
    const response = await POST(
      catalogoRequest({ to: '+54 9 11 1111-2222', items: ['Pampers x24'] }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'La integración de WhatsApp no está configurada.',
    });
  });

  it('sends the catalogo template with 5 named params, padding empty slots with "-"', async () => {
    stubWhatsAppEnv();
    const fetchMock = stubGraphSuccess();

    const response = await POST(
      catalogoRequest({
        to: '+54 9 11 1111-2222',
        items: ['Pampers Premium x24', 'Huggies Natural x60'],
      }),
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      messageId: 'wamid.test',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('CatalogoOrderSchema (client form validation)', () => {
  it('accepts a valid phone and 1-5 items', () => {
    const result = CatalogoOrderSchema.safeParse({
      to: '+54 9 11 1111-2222',
      items: ['Pampers x24'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects a missing/short phone', () => {
    const result = CatalogoOrderSchema.safeParse({ to: '', items: ['Pampers x24'] });
    expect(result.success).toBe(false);
  });

  it('rejects an empty basket', () => {
    const result = CatalogoOrderSchema.safeParse({ to: '+54 9 11 1111-2222', items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects more than 5 items', () => {
    const result = CatalogoOrderSchema.safeParse({
      to: '+54 9 11 1111-2222',
      items: ['1', '2', '3', '4', '5', '6'],
    });
    expect(result.success).toBe(false);
  });
});
