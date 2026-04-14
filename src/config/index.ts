import { getCloudflareContext } from "@opennextjs/cloudflare";

type AppEnv = "development" | "production";

const appEnv: AppEnv =
	(process.env.NEXTJS_ENV as AppEnv | undefined) ??
	(process.env.NODE_ENV === "production" ? "production" : "development");

const development = {
	env: "development" as const,
	contentful: {
		space: process.env.CONTENTFUL_SPACE_ID ?? "",
		accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN ?? "",
		environment: "master",
	},
};

const production = {
	env: "production" as const,
	contentful: {
		space: process.env.CONTENTFUL_SPACE_ID ?? "",
		accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN ?? "",
		environment: "master",
	},
};

const base = appEnv === "production" ? production : development;

const config = {
	...base,
	// Read lazily from the Cloudflare Worker binding on each access.
	// Only callable inside a request handler (getCloudflareContext needs request scope).
	get telegram() {
		const { env } = getCloudflareContext();
		return {
			botToken: env.TELEGRAM_BOT_TOKEN,
			chatId: env.TELEGRAM_CHAT_ID,
		};
	},
};

export default config;
