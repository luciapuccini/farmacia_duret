"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import categories from "@/services/catalog/data/categories.json";
import { NavLink } from "@/ui";
import { nameToSlug } from "@/utils/nameToSlug";

import Drawer from "./components/drawer/drawer";
import styles from "./navbar.module.scss";

type Category = {
	name: string;
	subcategories?: Category[];
};

function subnavHref(
	category: Category,
	categoryPath: string,
	depth: number,
	parentPath: string,
) {
	if (depth === 0) return categoryPath;
	if (depth === 1) return `${parentPath}/${categoryPath}`;
	if (category.name === "Ver todos los productos") return parentPath;
	return `${parentPath}?f=${categoryPath.slice(1)}`;
}

function dropdownClass(depth: number) {
	return depth === 0
		? styles.dropdown
		: `${styles.dropdown} ${styles.dropdownNested}`;
}

function SubnavItem({
	category,
	depth = 0,
	parentPath = "",
	pathname,
}: {
	category: Category;
	depth?: number;
	parentPath?: string;
	pathname: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const hasSubcategories =
		category.subcategories && category.subcategories.length > 0;
	const categoryPath = `/${nameToSlug(category.name)}`;
	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);
	const href = subnavHref(category, categoryPath, depth, parentPath);
	const childParentPath =
		depth === 0 ? categoryPath : `${parentPath}/${categoryPath}`;

	return (
		<li
			className={styles.subnavItem}
			onMouseEnter={() => hasSubcategories && setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<NavLink
				href={href}
				active={depth < 2 && isActive(href)}
				variant={depth === 0 ? "subnav" : "dropdown"}
			>
				{category.name}
			</NavLink>

			{hasSubcategories && isOpen && (
				<ul className={dropdownClass(depth)}>
					{category.subcategories?.map((sub) => (
						<SubnavItem
							key={sub.name}
							category={sub}
							depth={depth + 1}
							parentPath={childParentPath}
							pathname={pathname}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

export default function Navbar() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const pathname = usePathname();

	const router = useRouter();
	const subnavCategories = categories.filter((c) => c.name !== "Ofertas");

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	const handleCatalogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const el = document.getElementById("catalogo");
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
			history.replaceState(null, "", "/");
		} else {
			router.push("/#catalogo");
		}
	};

	return (
		<>
			<header className={styles.navbar}>
				<div className={styles.navTop}>
					<Link href="/" className={styles.brand}>
						<span className={styles.logoMark} aria-hidden="true">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.4"
								strokeLinecap="round"
								strokeLinejoin="round"
								width="18"
								height="18"
								aria-hidden="true"
							>
								<path d="M12 4v16M4 12h16" />
							</svg>
						</span>
						Farmacia Duret
					</Link>

					<nav className={styles.navLinks} aria-label="Navegación principal">
						<NavLink
							href="/"
							active={pathname === "/"}
							variant="nav"
						>
							Catálogo
						</NavLink>
						<NavLink
							href="/contact"
							active={isActive("/contact")}
							variant="nav"
						>
							Contacto
						</NavLink>
					</nav>

					<div className={styles.navActions}>
						{/* TODO: Revisit CTA-styled navigation links once their shared semantics are clearer. */}
						<Link href="/orders" className={styles.navEncargo}>
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
							Hacer un encargo
						</Link>

						<button
							type="button"
							className={styles.menuButton}
							onClick={() => setIsDrawerOpen(true)}
							aria-label="Abrir menú"
						>
							<svg
								width="20"
								height="16"
								viewBox="0 0 20 16"
								fill="currentColor"
								aria-hidden="true"
							>
								<rect width="20" height="2" rx="1" />
								<rect y="7" width="20" height="2" rx="1" />
								<rect y="14" width="20" height="2" rx="1" />
							</svg>
						</button>
					</div>
				</div>

				{/* ── Sub-nav ribbon — desktop only ────────────── */}
				<nav className={styles.subnav} aria-label="Categorías">
					<div className={styles.subnavInner}>
						<NavLink
							href="/#catalogo"
							onClick={handleCatalogClick}
							active={pathname === "/"}
							variant="subnav"
						>
							Todo el catálogo
						</NavLink>
						<span className={styles.subnavDivider} aria-hidden="true" />
						<ul className={styles.subnavList}>
							{subnavCategories.map((cat) => (
								<SubnavItem key={cat.name} category={cat} pathname={pathname} />
							))}
						</ul>
						{/* TODO: Keep the Ofertas promo link local until it clearly fits an existing UI link primitive. */}
						<Link href="/offers" className={styles.subnavCta}>
							<span className={styles.subnavCtaDot} aria-hidden="true" />
							Ofertas
						</Link>
					</div>
				</nav>
			</header>

			<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
		</>
	);
}
