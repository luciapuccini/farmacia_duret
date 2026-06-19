"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import categories from "@/services/catalog/data/categories.json";
import type { TCategory, TFilters, TSubcategory } from "@/types/types";
import { NavLink } from "@/ui";
import { nameToSlug } from "@/utils/nameToSlug";
import styles from "./drawer.module.scss";

function filterHref(categorySlug: string, subcategorySlug: string, filterSlug: string) {
	const searchParams = new URLSearchParams({ sc: subcategorySlug, f: filterSlug });
	return `/${categorySlug}?${searchParams.toString()}`;
}

function subcategoryHref(categorySlug: string, subcategorySlug: string) {
	const searchParams = new URLSearchParams({ sc: subcategorySlug });
	return `/${categorySlug}?${searchParams.toString()}`;
}

interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

type DrawerNavItemProps = {
	category: TCategory | TSubcategory;
	depth?: number;
	onNavigate: () => void;
	parentCategorySlug?: string;
	pathname: string;
	activeSubcategory: string | null;
	activeFilter: string | null;
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
			className={styles.chevron}
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

function ToggleChevron({ isOpen }: { isOpen: boolean }) {
	return isOpen ? <ChevronDown /> : <ChevronRight />;
}

function TopLevelDrawerItem({
	category,
	categoryPath,
	hasChildren,
	isActive,
	isOpen,
	onNavigate,
	onToggle,
}: {
	category: TCategory;
	categoryPath: string;
	hasChildren: boolean;
	isActive: (href: string) => boolean;
	isOpen: boolean;
	onNavigate: () => void;
	onToggle: () => void;
}) {
	return (
		<div className={styles.drawerItemHeader}>
			<NavLink
				href={categoryPath}
				active={isActive(categoryPath)}
				onClick={onNavigate}
				variant="drawer"
			>
				{category.name}
			</NavLink>

			{hasChildren && (
				<button
					type="button"
					className={styles.drawerToggle}
					onClick={onToggle}
					aria-label={`${isOpen ? "Ocultar" : "Mostrar"} ${category.name}`}
					aria-expanded={isOpen}
				>
					<ToggleChevron isOpen={isOpen} />
				</button>
			)}
		</div>
	);
}

function SecondLevelDrawerItem({
	category,
	categorySlug,
	parentCategorySlug,
	hasFilters,
	isActive,
	isOpen,
	onNavigate,
	onToggle,
}: {
	category: TSubcategory;
	categorySlug: string;
	parentCategorySlug: string;
	hasFilters: boolean;
	isActive: (href: string) => boolean;
	isOpen: boolean;
	onNavigate: () => void;
	onToggle: () => void;
}) {
	const href = subcategoryHref(parentCategorySlug, categorySlug);

	return (
		<div className={styles.drawerItemHeader}>
			<NavLink
				href={href}
				active={isActive(href)}
				onClick={onNavigate}
				variant="drawer"
			>
				{category.name}
			</NavLink>

			{hasFilters && (
				<button
					type="button"
					className={styles.drawerToggle}
					onClick={onToggle}
					aria-label={`${isOpen ? "Ocultar" : "Mostrar"} ${category.name}`}
					aria-expanded={isOpen}
				>
					<ToggleChevron isOpen={isOpen} />
				</button>
			)}
		</div>
	);
}

function FilterDrawerItem({
	categorySlug,
	subcategorySlug,
	filter,
	pathname,
	activeSubcategory,
	activeFilter,
	onNavigate,
}: {
	categorySlug: string;
	subcategorySlug: string;
	filter: TFilters;
	pathname: string;
	activeSubcategory: string | null;
	activeFilter: string | null;
	onNavigate: () => void;
}) {
	const filterSlug = nameToSlug(filter.name);
	const href = filter.url || filterHref(categorySlug, subcategorySlug, filterSlug);
	const isActive =
		pathname === `/${categorySlug}` &&
		activeSubcategory === subcategorySlug &&
		activeFilter === filterSlug;

	return (
		<NavLink href={href} active={isActive} onClick={onNavigate} variant="drawer">
			{filter.name}
		</NavLink>
	);
}

function DrawerNavItem({
	category,
	depth = 0,
	onNavigate,
	parentCategorySlug,
	pathname,
	activeSubcategory,
	activeFilter,
}: DrawerNavItemProps) {
	const [isOpen, setIsOpen] = useState(false);
	const hasSubcategories =
		"subcategories" in category && Boolean(category.subcategories?.length);
	const hasFilters = "filters" in category && Boolean(category.filters?.length);
	const categoryPath = `/${nameToSlug(category.name)}`;
	const categorySlug = nameToSlug(category.name);
	const isActiveLink = (href: string) => pathname === href;
	const toggleOpen = () => setIsOpen((open) => !open);

	let content = null;

	if (depth === 0) {
		content = (
			<TopLevelDrawerItem
				category={category as TCategory}
				categoryPath={categoryPath}
				hasChildren={Boolean(hasSubcategories)}
				isActive={isActiveLink}
				isOpen={isOpen}
				onNavigate={onNavigate}
				onToggle={toggleOpen}
			/>
		);
	}

	if (depth === 1 && parentCategorySlug) {
		content = (
			<SecondLevelDrawerItem
				category={category as TSubcategory}
				categorySlug={categorySlug}
				parentCategorySlug={parentCategorySlug}
				hasFilters={Boolean(hasFilters)}
				isActive={(href) =>
					pathname === `/${parentCategorySlug}` && href.includes(`sc=${categorySlug}`)
				}
				isOpen={isOpen}
				onNavigate={onNavigate}
				onToggle={toggleOpen}
			/>
		);
	}

	return (
		<div className={styles.drawerItem} data-depth={depth}>
			{content}

			{hasSubcategories && isOpen && (
				<div className={styles.drawerSubmenu}>
					{category.subcategories?.map((subcategory) => (
						<DrawerNavItem
							key={subcategory.name}
							category={subcategory}
							depth={depth + 1}
							onNavigate={onNavigate}
							parentCategorySlug={categorySlug}
							pathname={pathname}
							activeSubcategory={activeSubcategory}
							activeFilter={activeFilter}
						/>
					))}
				</div>
			)}

			{hasFilters && isOpen && parentCategorySlug && (
				<div className={styles.drawerSubmenu}>
					{category.filters?.map((filter) => (
						<div key={filter.name} className={styles.drawerItem} data-depth={depth + 1}>
							<FilterDrawerItem
								categorySlug={parentCategorySlug}
								subcategorySlug={categorySlug}
								filter={filter}
								pathname={pathname}
								activeSubcategory={activeSubcategory}
								activeFilter={activeFilter}
								onNavigate={onNavigate}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeSubcategory = searchParams.get("sc");
	const activeFilter = searchParams.get("f");

	return (
		<>
			{isOpen && (
				<div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
			)}

			<div
				className={styles.drawer}
				data-open={isOpen}
				role="dialog"
				aria-modal="true"
				aria-label="Menú de navegación"
			>
				{/* Header: brand + close */}
				<div className={styles.drawerHeader}>
					<Link href="/" className={styles.drawerBrand} onClick={onClose}>
						Farmacia Duret
					</Link>
					<button
						type="button"
						className={styles.closeButton}
						onClick={onClose}
						aria-label="Cerrar menú"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M1 1l14 14M15 1L1 15"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				{/* Nav items */}
				<nav className={styles.drawerNav} aria-label="Categorías">
					{(categories as TCategory[]).map((category) => (
						<DrawerNavItem
							key={category.name}
							category={category}
							onNavigate={onClose}
							pathname={pathname}
							activeSubcategory={activeSubcategory}
							activeFilter={activeFilter}
						/>
					))}
					<div className={styles.drawerItem} data-depth={0}>
						<NavLink
							href="/contact"
							active={pathname === "/contact"}
							onClick={onClose}
							variant="drawer"
						>
							Contacto
						</NavLink>
					</div>
				</nav>

				{/* Footer CTA */}
				<div className={styles.drawerFooter}>
					{/* TODO: Revisit CTA-styled navigation links once their shared semantics are clearer. */}
					<Link href="/orders" className={styles.drawerCta} onClick={onClose}>
						Hacer un encargo
					</Link>
				</div>
			</div>
		</>
	);
}
