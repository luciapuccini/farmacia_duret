import { createClient } from "contentful";
import config from "@/config";

export const contentfulClient = createClient({
	space: config.contentful.space,
	accessToken: config.contentful.accessToken,
	environment: config.contentful.environment,
});
