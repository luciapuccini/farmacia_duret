"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import categories from "@/data/categories.json";
import { useMediaQuery } from "@/helpers/hooks";
import { categoryNameToPath } from "@/helpers/routes";

import Drawer from "./components/drawer";
import styles from "./navbar.module.scss";

type Category = {
	nombre: string;
	subcategorias?: Category[];
};


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
		category.subcategorias && category.subcategorias.length > 0;
	const categoryPath = categoryNameToPath(category.nombre);
	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<li
			className={styles.subnavItem}
			onMouseEnter={() => hasSubcategories && setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{depth === 0 && (
				<Link
					href={categoryPath}
					className={
						isActive(categoryPath)
							? `${styles.subnavLink} ${styles.subnavLinkActive}`
							: styles.subnavLink
					}
				>
					{category.nombre}
				</Link>
			)}

			{depth === 1 && (
				<Link
					href={`${parentPath}/${categoryPath}`}
					className={
						isActive(`${parentPath}/${categoryPath}`)
							? `${styles.dropdownLink} ${styles.dropdownLinkActive}`
							: styles.dropdownLink
					}
				>
					{category.nombre}
				</Link>
			)}

			{depth === 2 && (
				<Link
					href={
						category.nombre === "Ver todos los productos"
							? parentPath
							: `${parentPath}?f=${categoryPath.slice(1)}`
					}
					className={styles.dropdownLink}
				>
					{category.nombre}
				</Link>
			)}

			{hasSubcategories && isOpen && (
				<ul
					className={
						depth === 0
							? styles.dropdown
							: `${styles.dropdown} ${styles.dropdownNested}`
					}
				>
					{category.subcategorias?.map((sub) => (
						<SubnavItem
							key={sub.nombre}
							category={sub}
							depth={depth + 1}
							parentPath={
								depth === 0 ? categoryPath : `${parentPath}/${categoryPath}`
							}
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
	const isMobile = useMediaQuery("(max-width: 767px)");
	const pathname = usePathname();

	const subnavCategories = categories.filter((c) => c.nombre !== "Ofertas");

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<>
			<header className={styles.navbar}>
				{/* ── Top row ─────────────────────────────────── */}
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
						<Link
							href="/"
							className={
								pathname === "/"
									? `${styles.navLink} ${styles.navLinkActive}`
									: styles.navLink
							}
						>
							Catálogo
						</Link>
						<Link
							href="/contacto"
							className={
								isActive("/contacto")
									? `${styles.navLink} ${styles.navLinkActive}`
									: styles.navLink
							}
						>
							Contacto
						</Link>
					</nav>

					<div className={styles.navActions}>
						<Link href="/reservas" className={styles.navEncargo}>
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
						<Link
							href="/"
							className={
								pathname === "/"
									? `${styles.subnavLink} ${styles.subnavLinkActive}`
									: styles.subnavLink
							}
						>
							Todo el catálogo
						</Link>
						<span className={styles.subnavDivider} aria-hidden="true" />
						<ul className={styles.subnavList}>
							{subnavCategories.map((cat) => (
								<SubnavItem
									key={cat.nombre}
									category={cat}
									pathname={pathname}
								/>
							))}
						</ul>
						<Link href="/ofertas" className={styles.subnavCta}>
							<span className={styles.subnavCtaDot} aria-hidden="true" />
							Ofertas
						</Link>
					</div>
				</nav>
			</header>

			{isMobile && (
				<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
			)}
		</>
	);
}
