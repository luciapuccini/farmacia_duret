"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import categories from "@/services/catalog/data/categories.json";
import type { TCategory, TFilters, TSubcategory } from "@/types/types";
import { NavLink } from "@/ui";
import { nameToSlug } from "@/utils/nameToSlug";

import Drawer from "./components/drawer/drawer";
import styles from "./navbar.module.scss";

function filterHref(categorySlug: string, subcategorySlug: string, filterSlug: string) {
	const searchParams = new URLSearchParams({ sc: subcategorySlug, f: filterSlug });
	return `/${categorySlug}?${searchParams.toString()}`;
}

function subcategoryHref(categorySlug: string, subcategorySlug: string) {
	const searchParams = new URLSearchParams({ sc: subcategorySlug });
	return `/${categorySlug}?${searchParams.toString()}`;
}

function dropdownClass(depth: number) {
	return depth === 0
		? styles.dropdown
		: `${styles.dropdown} ${styles.dropdownNested}`;
}

function FilterItem({
	categorySlug,
	subcategorySlug,
	filter,
	pathname,
	activeSubcategory,
	activeFilter,
}: {
	categorySlug: string;
	subcategorySlug: string;
	filter: TFilters;
	pathname: string;
	activeSubcategory: string | null;
	activeFilter: string | null;
}) {
	const filterSlug = nameToSlug(filter.name);
	const href = filter.url || filterHref(categorySlug, subcategorySlug, filterSlug);
	const isActive =
		pathname === `/${categorySlug}` &&
		activeSubcategory === subcategorySlug &&
		activeFilter === filterSlug;

	return (
		<li className={styles.subnavItem}>
			<NavLink href={href} active={isActive} variant="dropdown">
				{filter.name}
			</NavLink>
		</li>
	);
}

function SubnavItem({
	category,
	depth = 0,
	parentCategorySlug,
	pathname,
	activeSubcategory,
	activeFilter,
}: {
	category: TCategory | TSubcategory;
	depth?: number;
	parentCategorySlug?: string;
	pathname: string;
	activeSubcategory: string | null;
	activeFilter: string | null;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const categorySlug = nameToSlug(category.name);
	const hasSubcategories =
		"subcategories" in category && Boolean(category.subcategories?.length);
	const hasFilters = "filters" in category && Boolean(category.filters?.length);
	const href =
		depth === 0
			? `/${categorySlug}`
			: subcategoryHref(parentCategorySlug!, categorySlug);
	const isActive =
		depth === 0
			? pathname === href
			: pathname === `/${parentCategorySlug}` && activeSubcategory === categorySlug;

	return (
		<li
			className={styles.subnavItem}
			onMouseEnter={() => (hasSubcategories || hasFilters) && setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<NavLink
				href={href}
				active={isActive}
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
							parentCategorySlug={depth === 0 ? categorySlug : parentCategorySlug}
							pathname={pathname}
							activeSubcategory={activeSubcategory}
							activeFilter={activeFilter}
						/>
					))}
				</ul>
			)}

			{hasFilters && isOpen && (
				<ul className={dropdownClass(depth)}>
					{category.filters?.map((filter) => (
						<FilterItem
							key={filter.name}
							categorySlug={parentCategorySlug!}
							subcategorySlug={categorySlug}
							filter={filter}
							pathname={pathname}
							activeSubcategory={activeSubcategory}
							activeFilter={activeFilter}
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
	const searchParams = useSearchParams();

	const router = useRouter();
	const subnavCategories = (categories as TCategory[]).filter(
		(c) => c.name !== "Ofertas",
	);
	const activeSubcategory = searchParams.get("sc");
	const activeFilter = searchParams.get("f");

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
						<NavLink href="/" active={pathname === "/"} variant="nav">
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
								<SubnavItem
									key={cat.name}
									category={cat}
									pathname={pathname}
									activeSubcategory={activeSubcategory}
									activeFilter={activeFilter}
								/>
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
