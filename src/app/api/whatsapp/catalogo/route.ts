import { z, ZodError } from 'zod';

import {
  getWhatsAppApiConfig,
  sendTemplateMessage,
  WhatsAppApiError,
} from '@/app/api/whatsapp/service';

const TEMPLATE_PEDIDO_CATALOGO = 'pedido_catalogo';
const MANDATORY_PARAMS = 5;

type CatalogoTemplateConfig = {
  templateName: string;
};

function getCatalogoTemplateConfig(): CatalogoTemplateConfig {
  const templateName = process.env.WHATSAPP_CATALOGO_TEMPLATE_NAME?.trim() ?? '';

  if (!templateName) {
    throw new WhatsAppApiError(
      'Missing WhatsApp catalogo configuration: templateName',
      503,
      'La integración de WhatsApp no está configurada.',
    );
  }

  return { templateName };
}

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

const ListItemParam = z.object({
  type: z.literal('text'),
  parameter_name: z.enum([
    'list_item_1',
    'list_item_2',
    'list_item_3',
    'list_item_4',
    'list_item_5',
  ]),
  text: z.string().max(150),
});

const PayloadSchema = z.object({
  messaging_product: z.literal('whatsapp'),
  recipient_type: z.literal('individual'),
  to: z.string().transform(normalizePhoneNumber),
  type: z.literal('template'),
  template: z.object({
    name: z.literal(TEMPLATE_PEDIDO_CATALOGO),
    language: z.object({ code: z.string().min(1) }),
    components: z.tuple([
      z.object({
        type: z.literal('body'),
        parameters: z.tuple([
          ListItemParam,
          ListItemParam,
          ListItemParam,
          ListItemParam,
          ListItemParam,
        ]),
      }),
    ]),
  }),
});

function buildTemplateComponents(items: string[]): Array<Record<string, unknown>> {
  const mapParameters = Array.from({ length: MANDATORY_PARAMS }, (_, i) => ({
    type: 'text',
    parameter_name: `list_item_${i + 1}`,
    text: items[i]?.trim() || '-',
  }));

  return [{ type: 'body', parameters: mapParameters }];
}

async function sendCatalogoTemplate(to: string, items: string[]): Promise<string | null> {
  const apiConfig = getWhatsAppApiConfig();
  const templateConfig = getCatalogoTemplateConfig();

  const payload = PayloadSchema.parse({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: normalizePhoneNumber(to),
    type: 'template',
    template: {
      name: templateConfig.templateName,
      language: {
        code: apiConfig.templateLanguage,
      },
      components: buildTemplateComponents(items),
    },
  });

  return sendTemplateMessage(apiConfig, payload, 'catalogo');
}

export async function POST(request: Request) {
  // `to` and `items` are validated client-side (CatalogoOrderSchema) before they
  // reach here, so the route is a thin proxy into sendCatalogoTemplate.
  let body: { to: string; items: string[] };

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'La solicitud no es válida.' }, { status: 400 });
  }

  try {
    const messageId = await sendCatalogoTemplate(body.to, body.items);

    return Response.json({ ok: true, messageId });
  } catch (error) {
    if (error instanceof WhatsAppApiError) {
      console.warn('[whatsapp:catalogo] send failed', error.message);
      const publicMessage =
        error.status === 502 ? 'No pudimos enviar el pedido por WhatsApp.' : error.publicMessage;

      return Response.json({ ok: false, error: publicMessage }, { status: error.status });
    }

    if (error instanceof ZodError) {
      console.error('[whatsapp:catalogo] payload validation failed', error.issues);
      return Response.json(
        { ok: false, error: 'No pudimos enviar el pedido por WhatsApp.' },
        { status: 500 },
      );
    }

    console.error('[whatsapp:catalogo] unexpected error', error);
    return Response.json(
      { ok: false, error: 'No pudimos enviar el pedido por WhatsApp.' },
      { status: 500 },
    );
  }
}
