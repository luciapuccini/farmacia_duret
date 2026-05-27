"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import categories from "@/services/catalog/data/categories.json";
import { nameToSlug } from "@/utils/nameToSlug";
import styles from "./drawer.module.scss";

type Category = {
	name: string;
	subcategories?: Category[];
};

interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

type DrawerNavItemProps = {
	category: Category;
	depth?: number;
	onNavigate: () => void;
	parentPath?: string;
	pathname: string;
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

function drawerButtonClass(isActive: boolean) {
	return isActive
		? `${styles.drawerItemButton} ${styles.drawerItemButtonActive}`
		: styles.drawerItemButton;
}

function ToggleChevron({ isOpen }: { isOpen: boolean }) {
	return isOpen ? <ChevronDown /> : <ChevronRight />;
}

function TopLevelDrawerItem({
	category,
	categoryPath,
	hasSubcategories,
	isActive,
	isOpen,
	onNavigate,
	onToggle,
}: {
	category: Category;
	categoryPath: string;
	hasSubcategories: boolean;
	isActive: (href: string) => boolean;
	isOpen: boolean;
	onNavigate: () => void;
	onToggle: () => void;
}) {
	return (
		<div className={styles.drawerItemHeader}>
			<Link
				href={categoryPath}
				className={drawerButtonClass(isActive(categoryPath))}
				onClick={onNavigate}
			>
				{category.name}
			</Link>

			{hasSubcategories && (
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
	categoryPath,
	hasSubcategories,
	isActive,
	onNavigate,
	parentPath,
}: {
	category: Category;
	categoryPath: string;
	hasSubcategories: boolean;
	isActive: (href: string) => boolean;
	onNavigate: () => void;
	parentPath: string;
}) {
	const href = `${parentPath}/${categoryPath}`;

	return (
		<Link
			href={href}
			className={drawerButtonClass(isActive(href))}
			onClick={onNavigate}
		>
			{category.name}
			{hasSubcategories && <ChevronRight />}
		</Link>
	);
}

function DeepDrawerItem({
	category,
	categoryPath,
	hasSubcategories,
	isOpen,
	onNavigate,
	onToggle,
	parentPath,
}: {
	category: Category;
	categoryPath: string;
	hasSubcategories: boolean;
	isOpen: boolean;
	onNavigate: () => void;
	onToggle: () => void;
	parentPath: string;
}) {
	if (!hasSubcategories) {
		return (
			<Link
				href={
					category.name === "Ver todos los productos"
						? parentPath
						: `${parentPath}?f=${categoryPath.slice(1)}`
				}
				className={styles.drawerItemButton}
				onClick={onNavigate}
			>
				{category.name}
			</Link>
		);
	}

	return (
		<button
			type="button"
			className={styles.drawerItemButton}
			onClick={onToggle}
			aria-expanded={isOpen}
		>
			{category.name}
			<ToggleChevron isOpen={isOpen} />
		</button>
	);
}

function DrawerNavItem({
	category,
	depth = 0,
	onNavigate,
	parentPath = "",
	pathname,
}: DrawerNavItemProps) {
	const [isOpen, setIsOpen] = useState(false);
	const hasSubcategories =
		category.subcategories && category.subcategories.length > 0;
	const categoryPath = `/${nameToSlug(category.name)}`;
	const isActiveLink = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);
	const toggleOpen = () => setIsOpen((open) => !open);
	const childParentPath =
		depth === 0 ? categoryPath : `${parentPath}${categoryPath}`;

	let content = (
		<DeepDrawerItem
			category={category}
			categoryPath={categoryPath}
			hasSubcategories={Boolean(hasSubcategories)}
			isOpen={isOpen}
			onNavigate={onNavigate}
			onToggle={toggleOpen}
			parentPath={parentPath}
		/>
	);

	if (depth === 0) {
		content = (
			<TopLevelDrawerItem
				category={category}
				categoryPath={categoryPath}
				hasSubcategories={Boolean(hasSubcategories)}
				isActive={isActiveLink}
				isOpen={isOpen}
				onNavigate={onNavigate}
				onToggle={toggleOpen}
			/>
		);
	}

	if (depth === 1) {
		content = (
			<SecondLevelDrawerItem
				category={category}
				categoryPath={categoryPath}
				hasSubcategories={Boolean(hasSubcategories)}
				isActive={isActiveLink}
				onNavigate={onNavigate}
				parentPath={parentPath}
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
							parentPath={childParentPath}
							pathname={pathname}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
	const pathname = usePathname();

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
					{categories.map((category: Category) => (
						<DrawerNavItem
							key={category.name}
							category={category}
							onNavigate={onClose}
							pathname={pathname}
						/>
					))}
					<div className={styles.drawerItem} data-depth={0}>
						<Link
							href="/contact"
							className={
								pathname === "/contact"
									? `${styles.drawerItemButton} ${styles.drawerItemButtonActive}`
									: styles.drawerItemButton
							}
							onClick={onClose}
						>
							Contacto
						</Link>
					</div>
				</nav>

				{/* Footer CTA */}
				<div className={styles.drawerFooter}>
					<Link href="/orders" className={styles.drawerCta} onClick={onClose}>
						Hacer un encargo
					</Link>
				</div>
			</div>
		</>
	);
}
