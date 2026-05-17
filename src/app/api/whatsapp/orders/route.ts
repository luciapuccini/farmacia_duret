const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
]);

type WhatsAppConfig = {
	accessToken: string;
	apiVersion: string;
	phoneNumberId: string;
	recipientPhoneNumber: string;
	imageTemplateName: string;
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
	return process.env[name]?.trim() ?? "";
}

function getConfig(): WhatsAppConfig {
	const config = {
		accessToken: env("WHATSAPP_ACCESS_TOKEN"),
		apiVersion: env("WHATSAPP_GRAPH_API_VERSION") || "v25.0",
		phoneNumberId: env("WHATSAPP_PHONE_NUMBER_ID"),
		recipientPhoneNumber: env("WHATSAPP_ORDER_RECIPIENT_PHONE_NUMBER"),
		imageTemplateName: env("WHATSAPP_ORDER_IMAGE_TEMPLATE_NAME"),
		templateLanguage: env("WHATSAPP_ORDER_TEMPLATE_LANGUAGE") || "es_AR",
		templateName: env("WHATSAPP_ORDER_TEMPLATE_NAME"),
	};
	const missing = Object.entries(config)
		.filter(([key, value]) => key !== "imageTemplateName" && !value)
		.map(([key]) => key);

	if (missing.length) {
		throw new WhatsAppOrderError(
			`Missing WhatsApp order configuration: ${missing.join(", ")}`,
			503,
			"La integración de WhatsApp no está configurada.",
		);
	}

	return config;
}

function getFormString(formData: FormData, field: string): string {
	const value = formData.get(field);
	return typeof value === "string" ? value.trim() : "";
}

function normalizePhoneNumber(phoneNumber: string): string {
	return phoneNumber.replace(/\D/g, "");
}

function getCustomerPhone(formData: FormData): string {
	const countryDial = getFormString(formData, "countryDial");
	const phone = getFormString(formData, "phone")
		.replace(/^\+?\s*/, "")
		.replace(/^0+/, "");

	return normalizePhoneNumber(`${countryDial}${phone}`);
}

function getImage(formData: FormData): File | null {
	const image = formData.get("image");

	if (!(image instanceof File) || image.size === 0) {
		return null;
	}

	if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
		throw new WhatsAppOrderError(
			`Unsupported image type: ${image.type || "unknown"}`,
			400,
			"La imagen debe ser JPG, PNG o WebP.",
		);
	}

	if (image.size > MAX_IMAGE_SIZE_BYTES) {
		throw new WhatsAppOrderError(
			`Image is too large: ${image.size} bytes`,
			400,
			"La imagen debe pesar hasta 5 MB.",
		);
	}

	return image;
}

async function readGraphPayload(response: Response): Promise<unknown> {
	try {
		return await response.json();
	} catch {
		return null;
	}
}

function graphErrorMessage(payload: unknown): string {
	if (!payload || typeof payload !== "object") {
		return "Unknown WhatsApp API error";
	}

	const error = (payload as { error?: { message?: unknown } }).error;
	return typeof error?.message === "string"
		? error.message
		: "Unknown WhatsApp API error";
}

async function uploadImageToWhatsApp(
	config: WhatsAppConfig,
	image: File,
): Promise<string> {
	const body = new FormData();
	body.set("messaging_product", "whatsapp");
	body.set("file", image, image.name || "order-image");

	const response = await fetch(
		`https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/media`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.accessToken}`,
			},
			body,
		},
	);
	const payload = await readGraphPayload(response);

	if (!response.ok) {
		throw new WhatsAppOrderError(
			`WhatsApp media upload failed: ${graphErrorMessage(payload)}`,
			502,
			"No pudimos adjuntar la imagen en WhatsApp.",
		);
	}

	const mediaId = (payload as { id?: unknown } | null)?.id;
	if (typeof mediaId !== "string") {
		throw new WhatsAppOrderError(
			"WhatsApp media upload did not return a media id",
			502,
			"No pudimos adjuntar la imagen en WhatsApp.",
		);
	}

	return mediaId;
}

function buildTemplateComponents(
	formData: FormData,
	mediaId: string | null,
): Array<Record<string, unknown>> {
	const name = getFormString(formData, "name");
	const phone = getCustomerPhone(formData);
	const email = getFormString(formData, "email") || "-";
	const notes = getFormString(formData, "notes") || "-";
	const components: Array<Record<string, unknown>> = [];

	if (mediaId) {
		components.push({
			type: "header",
			parameters: [
				{
					type: "image",
					image: { id: mediaId },
				},
			],
		});
	}

	components.push({
		type: "body",
		parameters: [
			{ type: "text", text: name },
			{ type: "text", text: phone },
			{ type: "text", text: email },
			{ type: "text", text: notes },
		],
	});

	return components;
}

async function sendOrderTemplate(
	config: WhatsAppConfig,
	formData: FormData,
	mediaId: string | null,
): Promise<string | null> {
	const payload = {
		messaging_product: "whatsapp",
		recipient_type: "individual",
		to: normalizePhoneNumber(config.recipientPhoneNumber),
		type: "template",
		template: {
			name: mediaId
				? config.imageTemplateName || config.templateName
				: config.templateName,
			language: {
				code: config.templateLanguage,
			},
			components: buildTemplateComponents(formData, mediaId),
		},
	};

	const response = await fetch(
		`https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		},
	);
	const responsePayload = await readGraphPayload(response);

	if (!response.ok) {
		throw new WhatsAppOrderError(
			`WhatsApp template send failed: ${graphErrorMessage(responsePayload)}`,
			502,
			"No pudimos enviar el encargo por WhatsApp.",
		);
	}

	const message = (
		responsePayload as { messages?: Array<{ id?: unknown }> } | null
	)?.messages?.[0]?.id;

	return typeof message === "string" ? message : null;
}

export async function POST(request: Request) {
	let formData: FormData;

	try {
		formData = await request.formData();
	} catch {
		return Response.json(
			{ ok: false, error: "La solicitud no es válida." },
			{ status: 400 },
		);
	}

	if (getFormString(formData, "bot-field")) {
		return Response.json({ ok: true, skipped: true });
	}

	const name = getFormString(formData, "name");
	const phone = getCustomerPhone(formData);

	if (!name || !phone) {
		return Response.json(
			{ ok: false, error: "Nombre y teléfono son obligatorios." },
			{ status: 400 },
		);
	}

	try {
		const config = getConfig();
		const image = getImage(formData);
		const mediaId = image ? await uploadImageToWhatsApp(config, image) : null;
		const messageId = await sendOrderTemplate(config, formData, mediaId);

		return Response.json({ ok: true, messageId, hasImage: Boolean(mediaId) });
	} catch (error) {
		if (error instanceof WhatsAppOrderError) {
			console.warn("[whatsapp:orders] send failed", error.message);
			return Response.json(
				{ ok: false, error: error.publicMessage },
				{ status: error.status },
			);
		}

		console.error("[whatsapp:orders] unexpected error", error);
		return Response.json(
			{ ok: false, error: "No pudimos enviar el encargo por WhatsApp." },
			{ status: 500 },
		);
	}
}
