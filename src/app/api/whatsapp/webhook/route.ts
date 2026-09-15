function getVerifyToken(): string | undefined {
  return process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
}

type WebhookChange = {
  field?: unknown;
  value?: {
    messaging_product?: unknown;
    metadata?: {
      phone_number_id?: unknown;
      display_phone_number?: unknown;
    };
    messages?: unknown[];
    statuses?: unknown[];
  };
};

type WebhookPayload = {
  object?: unknown;
  entry?: Array<{
    changes?: WebhookChange[];
  }>;
};

// Sums `value[key]` lengths across every change of every entry.
function countChangeValues(body: WebhookPayload, key: 'messages' | 'statuses'): number {
  return (
    body.entry?.reduce(
      (total, entry) =>
        total +
        (entry.changes?.reduce(
          (changeTotal, change) => changeTotal + (change.value?.[key]?.length ?? 0),
          0,
        ) ?? 0),
      0,
    ) ?? 0
  );
}

// Collects `select(change)` across every change, dropping falsy results.
function collectFromChanges(
  body: WebhookPayload,
  select: (change: WebhookChange) => unknown,
): unknown[] {
  return body.entry?.flatMap((entry) => entry.changes?.map(select).filter(Boolean) ?? []) ?? [];
}

function summarizeWebhookPayload(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false };
  }

  const body = payload as WebhookPayload;

  return {
    object: body.object,
    entries: body.entry?.length ?? 0,
    fields: collectFromChanges(body, (change) => change.field),
    messageCount: countChangeValues(body, 'messages'),
    statusCount: countChangeValues(body, 'statuses'),
    phoneNumberIds: collectFromChanges(body, (change) => change.value?.metadata?.phone_number_id),
  };
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get('hub.mode');
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');
  const verifyToken = getVerifyToken();

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.warn('[whatsapp:webhook] verification failed', {
    mode,
    hasChallenge: Boolean(challenge),
    hasVerifyToken: Boolean(verifyToken),
  });

  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  console.info('[whatsapp:webhook] event received', summarizeWebhookPayload(payload));

  return Response.json({ ok: true });
}
