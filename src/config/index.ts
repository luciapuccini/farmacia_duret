import { SITE_URL } from "@/config/site";

type AppEnv = "development" | "production";

const appEnv: AppEnv =
	(process.env.NEXTJS_ENV as AppEnv | undefined) ??
	(process.env.NODE_ENV === "production" ? "production" : "development");

const development = {
	env: "development" as const,
	contentful: {
		space: process.env.CONTENTFUL_SPACE_ID ?? "",
		accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN ?? "",
		environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
	},
};

const production = {
	env: "production" as const,
	contentful: {
		space: process.env.CONTENTFUL_SPACE_ID ?? "",
		accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN ?? "",
		environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
	},
};

const base = appEnv === "production" ? production : development;

const config = {
	...base,
	siteUrl: SITE_URL,
};

export default config;
