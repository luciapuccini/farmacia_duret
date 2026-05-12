import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Overkill, but nice to have this is the correct way to do it
	async redirects() {
		return [
			// legacy Spanish routes → English equivalents
			{ source: "/contacto", destination: "/contact", permanent: true },
			{ source: "/ofertas", destination: "/offers", permanent: true },
			{ source: "/reservas", destination: "/orders", permanent: true },
			// deep redirect that previously pointed at Spanish route
			{
				source: "/medicamentos/venta-bajo-receta",
				destination: "/orders",
				permanent: true,
			},
		];
	},
};

export default nextConfig;

initOpenNextCloudflareForDev();
