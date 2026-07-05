import { z, ZodError } from 'zod';

import {
  getWhatsAppApiConfig,
  sendTemplateMessage,
  WhatsAppApiError,
} from '@/app/api/whatsapp/service';

const TEMPLATE_PEDIDO_SIMPLE = 'pedido_imagen';

type OrderTemplateConfig = {
  templateName: string;
};

function getOrderTemplateConfig(): OrderTemplateConfig {
  const templateName = process.env.WHATSAPP_ORDER_TEMPLATE_NAME?.trim() ?? '';

  if (!templateName) {
    throw new WhatsAppApiError(
      'Missing WhatsApp order configuration: templateName',
      503,
      'La integración de WhatsApp no está configurada.',
    );
  }

  return { templateName };
}

function getFormString(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

const PedidoImagenParam = z.object({
  type: z.literal('text'),
  parameter_name: z.enum(['name', 'phone', 'email', 'notes']),
  text: z.string(),
});

const PayloadSchema = z.object({
  messaging_product: z.literal('whatsapp'),
  recipient_type: z.literal('individual'),
  to: z.string().transform(normalizePhoneNumber),
  type: z.literal('template'),
  template: z.object({
    name: z.literal(TEMPLATE_PEDIDO_SIMPLE),
    language: z.object({ code: z.string().min(1) }),
    components: z.tuple([
      z.object({
        type: z.literal('body'),
        parameters: z.tuple([
          PedidoImagenParam,
          PedidoImagenParam,
          PedidoImagenParam,
          PedidoImagenParam,
        ]),
      }),
    ]),
  }),
});

function getCustomerPhone(formData: FormData): string {
  const countryDial = getFormString(formData, 'countryDial');
  const phone = getFormString(formData, 'phone')
    .replace(/^\+?\s*/, '')
    .replace(/^0+/, '');

  return normalizePhoneNumber(`${countryDial}${phone}`);
}

function buildTemplateComponents(formData: FormData): Array<Record<string, unknown>> {
  const name = getFormString(formData, 'name');
  const phone = getCustomerPhone(formData);
  const email = getFormString(formData, 'email') || '-';
  const notes = getFormString(formData, 'notes') || '-';

  return [
    {
      type: 'body',
      parameters: [
        { type: 'text', parameter_name: 'name', text: name },
        { type: 'text', parameter_name: 'phone', text: phone },
        { type: 'text', parameter_name: 'email', text: email },
        { type: 'text', parameter_name: 'notes', text: notes },
      ],
    },
  ];
}

async function sendOrderTemplate(formData: FormData): Promise<string | null> {
  const apiConfig = getWhatsAppApiConfig();
  const templateConfig = getOrderTemplateConfig();

  const payload = PayloadSchema.parse({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: getCustomerPhone(formData),
    type: 'template',
    template: {
      name: templateConfig.templateName,
      language: {
        code: apiConfig.templateLanguage,
      },
      components: buildTemplateComponents(formData),
    },
  });

  return sendTemplateMessage(apiConfig, payload, 'orders');
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, error: 'La solicitud no es válida.' }, { status: 400 });
  }

  if (getFormString(formData, 'bot-field')) {
    return Response.json({ ok: true, skipped: true });
  }

  const name = getFormString(formData, 'name');
  const phone = getCustomerPhone(formData);

  if (!name || !phone) {
    return Response.json(
      { ok: false, error: 'Nombre y teléfono son obligatorios.' },
      { status: 400 },
    );
  }

  try {
    const messageId = await sendOrderTemplate(formData);

    return Response.json({ ok: true, messageId });
  } catch (error) {
    if (error instanceof WhatsAppApiError) {
      console.warn('[whatsapp:orders] send failed', error.message);
      const publicMessage =
        error.status === 502 ? 'No pudimos enviar el encargo por WhatsApp.' : error.publicMessage;

      return Response.json({ ok: false, error: publicMessage }, { status: error.status });
    }

    if (error instanceof ZodError) {
      console.error('[whatsapp:orders] payload validation failed', error.issues);
      return Response.json(
        { ok: false, error: 'No pudimos enviar el encargo por WhatsApp.' },
        { status: 500 },
      );
    }

    console.error('[whatsapp:orders] unexpected error', error);
    return Response.json(
      { ok: false, error: 'No pudimos enviar el encargo por WhatsApp.' },
      { status: 500 },
    );
  }
}
