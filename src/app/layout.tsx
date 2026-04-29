import "./reset.scss";
import Breadcrumb from "@/layout/breadcrumb";
import Container from "@/layout/container";
import Footer from "@/layout/footer";
import Navbar from "@/layout/navbar";
import PageHeader from "@/layout/PageHeader";
import PromoBanner from "@/layout/PromoBanner";

export const metadata = {
	title: "Farmacia Duret",
	icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="es">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<PromoBanner />
				<Navbar />
				<Container>
					<PageHeader />
					<Breadcrumb />
					{children}
				</Container>
				<Footer />
			</body>
		</html>
	);
}
