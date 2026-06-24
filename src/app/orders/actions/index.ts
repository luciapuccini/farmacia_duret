'use server';

export type Status = 'idle' | 'sent' | 'error';

type SendOrderReturn = {
  status: Status;
  message: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function sendOrder(_previousState, actionPayload: FormData): Promise<SendOrderReturn> {
  const resp = fetch(`${BASE_URL}/api/whatsapp/orders`, {
    method: 'POST',
    body: actionPayload,
  });

  const data = await resp;

  if (!data.ok) {
    return { status: 'error', message: 'No pudimos enviar el encargo. Intentá de nuevo.' };
  }

  return { status: 'sent', message: 'Order sent' };
}
