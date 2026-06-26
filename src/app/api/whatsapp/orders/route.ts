import { z, ZodError } from 'zod';

const TEMPLATE_PEDIDO_SIMPLE = 'pedido_imagen';

type WhatsAppConfig = {
  accessToken: string;
  apiVersion: string;
  phoneNumberId: string;
  recipientPhoneNumber: string;
  templateLanguage: string;
  templateName: string;
};

class WhatsAppOrderError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly publicMessage = message,
  ) {
    super(message);
  }
}

function env(name: keyof NodeJS.ProcessEnv): string {
  return process.env[name]?.trim() ?? '';
}

function getConfig(): WhatsAppConfig {
  const config = {
    accessToken: env('WHATSAPP_ACCESS_TOKEN'),
    apiVersion: env('WHATSAPP_GRAPH_API_VERSION') || 'v25.0',
    phoneNumberId: env('WHATSAPP_PHONE_NUMBER_ID'),
    recipientPhoneNumber: env('WHATSAPP_ORDER_RECIPIENT_PHONE_NUMBER'),
    templateLanguage: env('WHATSAPP_ORDER_TEMPLATE_LANGUAGE') || 'es_AR',
    templateName: env('WHATSAPP_ORDER_TEMPLATE_NAME'),
  };
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new WhatsAppOrderError(
      `Missing WhatsApp order configuration: ${missing.join(', ')}`,
      503,
      'La integración de WhatsApp no está configurada.',
    );
  }

  return config;
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

async function readGraphPayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function graphErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Unknown WhatsApp API error';
  }

  const error = (payload as { error?: { message?: unknown } }).error;
  return typeof error?.message === 'string' ? error.message : 'Unknown WhatsApp API error';
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
        { type: 'text', parameter_name: 'name',  text: name },
        { type: 'text', parameter_name: 'phone', text: phone },
        { type: 'text', parameter_name: 'email', text: email },
        { type: 'text', parameter_name: 'notes', text: notes },
      ],
    },
  ];
}

async function sendOrderTemplate(
  config: WhatsAppConfig,
  formData: FormData,
): Promise<string | null> {
  const payload = PayloadSchema.parse({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: config.recipientPhoneNumber,
    type: 'template',
    template: {
      name: config.templateName,
      language: {
        code: config.templateLanguage,
      },
      components: buildTemplateComponents(formData),
    },
  });

  console.log('[whatsapp:orders] sending template', {
    template: config.templateName,
    to: payload.to,
  });

  const response = await fetch(
    `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
  const responsePayload = await readGraphPayload(response);

  if (!response.ok) {
    console.error('[whatsapp:orders] graph response', {
      status: response.status,
      body: responsePayload,
    });
    throw new WhatsAppOrderError(
      `WhatsApp template send failed: ${graphErrorMessage(responsePayload)}`,
      502,
      'No pudimos enviar el encargo por WhatsApp.',
    );
  }

  const message = (responsePayload as { messages?: Array<{ id?: unknown }> } | null)?.messages?.[0]
    ?.id;

  return typeof message === 'string' ? message : null;
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
    const config = getConfig();
    const messageId = await sendOrderTemplate(config, formData);

    return Response.json({ ok: true, messageId });
  } catch (error) {
    if (error instanceof WhatsAppOrderError) {
      console.warn('[whatsapp:orders] send failed', error.message);
      return Response.json({ ok: false, error: error.publicMessage }, { status: error.status });
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
