export type WhatsAppApiConfig = {
  accessToken: string;
  apiVersion: string;
  phoneNumberId: string;
  templateLanguage: string;
};

export type WhatsAppTemplatePayload = {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: { code: string };
    components?: Array<Record<string, unknown>>;
  };
};

export class WhatsAppApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly publicMessage = message,
  ) {
    super(message);
  }
}

export function getWhatsAppApiConfig(): WhatsAppApiConfig {
  const config = {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN?.trim() ?? '',
    apiVersion: process.env.WHATSAPP_GRAPH_API_VERSION?.trim() || 'v25.0',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() ?? '',
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || 'es_AR',
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new WhatsAppApiError(
      `Missing WhatsApp API configuration: ${missing.join(', ')}`,
      503,
      'La integración de WhatsApp no está configurada.',
    );
  }

  return config;
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

export async function sendTemplateMessage(
  config: WhatsAppApiConfig,
  payload: WhatsAppTemplatePayload,
  logContext?: string,
): Promise<string | null> {
  if (logContext) {
    console.log(`[whatsapp:${logContext}] sending template`, {
      template: payload.template.name,
      to: payload.to,
    });
  }

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
    console.error(`[whatsapp:${logContext ?? 'api'}] graph response`, {
      status: response.status,
      body: responsePayload,
    });
    throw new WhatsAppApiError(
      `WhatsApp template send failed: ${graphErrorMessage(responsePayload)}`,
      502,
      'No pudimos enviar el mensaje por WhatsApp.',
    );
  }

  const messageId = (responsePayload as { messages?: Array<{ id?: unknown }> } | null)?.messages?.[0]
    ?.id;

  return typeof messageId === 'string' ? messageId : null;
}
