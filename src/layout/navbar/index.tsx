"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import CtaButton from "@/components/CtaButton";
import categories from "@/data/categories.json";
import { useMediaQuery } from "@/helpers/hooks";
import { categoryNameToPath } from "@/helpers/routes";

import Drawer from "./components/drawer";
import styles from "./navbar.module.scss";

type Category = {
	nombre: string;
	subcategorias?: Category[];
};

function ChevronDown() {
	return (
		<svg
			className={styles.chevron}
			width="10"
			height="6"
			viewBox="0 0 10 6"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M1 1l4 4 4-4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ChevronRight() {
	return (
		<svg
			className={styles.chevronRight}
			width="6"
			height="10"
			viewBox="0 0 6 10"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M1 1l4 4-4 4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function NavItem({
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
		pathname === href || pathname.startsWith(href + "/");

	return (
		<li
			className={styles.navItem}
			data-depth={depth}
			onMouseEnter={() => hasSubcategories && setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			onClick={() => setIsOpen(false)}
			onKeyDown={(e) => {
				if (e.key === "Escape") setIsOpen(false);
			}}
		>
			{depth === 0 ? (
				<Link
					href={categoryPath}
					className={
						isActive(categoryPath)
							? `${styles.navItemButton} ${styles.navItemButtonActive}`
							: styles.navItemButton
					}
					aria-expanded={isOpen}
				>
					{category.nombre}
					{hasSubcategories && <ChevronDown />}
				</Link>
			) : depth === 1 ? (
				<Link
					href={`${parentPath}/${categoryPath}`}
					className={
						isActive(`${parentPath}/${categoryPath}`)
							? `${styles.navItemButton} ${styles.navItemButtonActive}`
							: styles.navItemButton
					}
				>
					{category.nombre}
					{hasSubcategories && <ChevronRight />}
				</Link>
			) : depth === 2 ? (
				<Link
					href={
						category.nombre === "Ver todos los productos"
							? parentPath
							: `${parentPath}?f=${categoryPath.slice(1)}`
					}
					className={styles.navItemButton}
				>
					{category.nombre}
				</Link>
			) : (
				<button
					type="button"
					className={styles.navItemButton}
					onClick={() => hasSubcategories && setIsOpen(!isOpen)}
					aria-expanded={isOpen}
				>
					{category.nombre}
					{hasSubcategories && <ChevronRight />}
				</button>
			)}

			{hasSubcategories && isOpen && (
				<ul className={styles.submenu} data-depth={depth}>
					{category.subcategorias?.map((subcategory) => (
						<NavItem
							key={subcategory.nombre}
							category={subcategory}
							depth={depth + 1}
							parentPath={
								depth === 0 ? categoryPath : `${parentPath}${categoryPath}`
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

	return (
		<>
			<header className={styles.navbar}>
				{/* Top row: brand + CTA (desktop) / brand + hamburger (mobile) */}
				<div className={styles.navTop}>
					<Link href="/" className={styles.brand}>
						Farmacia Duret
					</Link>

					{/* Desktop CTA */}
					<CtaButton href="/reservas" className={styles.navCta}>
						Hacer un encargo
					</CtaButton>

					{/* Mobile hamburger */}
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

				{/* Categories row — desktop only */}
				<nav className={styles.navCategories} aria-label="Categorías">
					<ul className={styles.navList}>
						{categories.map((category) => (
							<NavItem
								key={category.nombre}
								category={category}
								pathname={pathname}
							/>
						))}
						<li className={styles.navItem} data-depth={0}>
							<Link
								href="/contacto"
								className={
									pathname === "/contacto"
										? `${styles.navItemButton} ${styles.navItemButtonActive}`
										: styles.navItemButton
								}
							>
								Contacto
							</Link>
						</li>
					</ul>
				</nav>
			</header>

			{isMobile && (
				<Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
			)}
		</>
	);
}
