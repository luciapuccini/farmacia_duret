function getVerifyToken(): string | undefined {
	return process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
}

function summarizeWebhookPayload(payload: unknown) {
	if (!payload || typeof payload !== "object") {
		return { valid: false };
	}

	const body = payload as {
		object?: unknown;
		entry?: Array<{
			changes?: Array<{
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
			}>;
		}>;
	};

	return {
		object: body.object,
		entries: body.entry?.length ?? 0,
		fields:
			body.entry?.flatMap((entry) =>
				entry.changes?.map((change) => change.field).filter(Boolean) ?? [],
			) ?? [],
		messageCount:
			body.entry?.reduce(
				(total, entry) =>
					total +
					(entry.changes?.reduce(
						(changeTotal, change) =>
							changeTotal + (change.value?.messages?.length ?? 0),
						0,
					) ?? 0),
				0,
			) ?? 0,
		statusCount:
			body.entry?.reduce(
				(total, entry) =>
					total +
					(entry.changes?.reduce(
						(changeTotal, change) =>
							changeTotal + (change.value?.statuses?.length ?? 0),
						0,
					) ?? 0),
				0,
			) ?? 0,
		phoneNumberIds:
			body.entry?.flatMap((entry) =>
				entry.changes
					?.map((change) => change.value?.metadata?.phone_number_id)
					.filter(Boolean) ?? [],
			) ?? [],
	};
}

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams;
	const mode = params.get("hub.mode");
	const token = params.get("hub.verify_token");
	const challenge = params.get("hub.challenge");
	const verifyToken = getVerifyToken();

	if (mode === "subscribe" && token === verifyToken && challenge) {
		return new Response(challenge, {
			status: 200,
			headers: { "Content-Type": "text/plain" },
		});
	}

	console.warn("[whatsapp:webhook] verification failed", {
		mode,
		hasChallenge: Boolean(challenge),
		hasVerifyToken: Boolean(verifyToken),
	});

	return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
	let payload: unknown;

	try {
		payload = await request.json();
	} catch {
		return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
	}

	console.info(
		"[whatsapp:webhook] event received",
		summarizeWebhookPayload(payload),
	);

	return Response.json({ ok: true });
}
