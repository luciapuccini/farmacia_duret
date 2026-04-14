import { NextResponse } from "next/server";
import config from "@/config";

export async function POST(request: Request) {
	const { botToken: token, chatId } = config.telegram;

	if (!token || !chatId) {
		console.error(
			"[notify-telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID",
		);
		return NextResponse.json(
			{ error: "Server misconfigured" },
			{ status: 500 },
		);
	}

	const formData = await request.formData();

	// Honeypot check — if filled, silently accept
	const botField = formData.get("bot-field");
	if (botField) {
		return NextResponse.json({ ok: true });
	}

	const name = (formData.get("name") as string) || "Sin nombre";
	const email = (formData.get("email") as string) || "Sin email";
	const telefono = (formData.get("telefono") as string) || "Sin teléfono";
	const encargo = (formData.get("encargo") as string) || "(sin detalle)";
	const imagen = formData.get("imagen") as File | null;
	console.log("🚀 ~ POST ~ imagen:", imagen);

	const lines = [
		"*Nuevo encargo recibido*",
		"",
		`👤 ${name}`,
		`📧 ${email}`,
		`📞 ${telefono}`,
		"",
		`📝 ${encargo}`,
	];

	const date = new Date().toLocaleString("es-AR", {
		timeZone: "America/Argentina/Buenos_Aires",
		dateStyle: "short",
		timeStyle: "short",
	});
	lines.push("", `_${date}_`);

	const text = lines.join("\n");

	if (imagen && imagen.size > 0) {
		const photoForm = new FormData();
		photoForm.append("chat_id", chatId);
		photoForm.append("photo", imagen, imagen.name);
		photoForm.append("caption", text);
		photoForm.append("parse_mode", "Markdown");

		const res = await fetch(
			`https://api.telegram.org/bot${token}/sendPhoto`,
			{ method: "POST", body: photoForm },
		);

		if (!res.ok) {
			const err = await res.text();
			console.error("[notify-telegram] Telegram sendPhoto error:", err);
			return NextResponse.json({ error: "Telegram API error" }, { status: 502 });
		}
	} else {
		const res = await fetch(
			`https://api.telegram.org/bot${token}/sendMessage`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
			},
		);

		if (!res.ok) {
			const err = await res.text();
			console.error("[notify-telegram] Telegram sendMessage error:", err);
			return NextResponse.json({ error: "Telegram API error" }, { status: 502 });
		}
	}

	return NextResponse.json({ ok: true });
}
