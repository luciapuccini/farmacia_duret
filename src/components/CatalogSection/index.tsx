"use client";

import Link from "next/link";
import { useState } from "react";
import { countProductsByCategory } from "@/utils/countProducts";
import styles from "./catalog-section.module.scss";

type ThumbVariant = "green" | "blue" | "accent" | "default";

type CategoryConfig = {
	name: string;
	slug: string;
	svg: string | null;
	tags: string[];
	thumbVariant: ThumbVariant;
	badge?: string;
};

const CATEGORIES: CategoryConfig[] = [
	{ name: "Dermocosmética",    slug: "dermocosmetica",    svg: "cat-skin.svg",     tags: ["cuidado"],      thumbVariant: "green"   },
	{ name: "Belleza",           slug: "belleza",           svg: null,               tags: ["cuidado"],      thumbVariant: "green"   },
	{ name: "Cuidado Personal",  slug: "cuidado-personal",  svg: "cat-oral.svg",     tags: ["cuidado"],      thumbVariant: "green"   },
	{ name: "Bebés",             slug: "bebes",             svg: "cat-baby.svg",     tags: ["bebes"],        thumbVariant: "green"   },
	{ name: "Hogar y Alimentos", slug: "hogar-y-alimentos", svg: null,               tags: [],               thumbVariant: "default" },
	{ name: "Salud y Farmacia",  slug: "salud-y-farmacia",  svg: "cat-vitamins.svg", tags: ["cuidado"],      thumbVariant: "green"   },
	{ name: "Medicamentos",      slug: "medicamentos",      svg: "cat-otc.svg",      tags: ["medicamentos"], thumbVariant: "blue"    },
	{ name: "Ofertas",           slug: "ofertas",           svg: null,               tags: ["ofertas"],      thumbVariant: "accent", badge: "Hasta −30%" },
];

const CHIPS = [
	{ label: "Todas",            filter: "all"          },
	{ label: "Medicamentos",     filter: "medicamentos" },
	{ label: "Cuidado personal", filter: "cuidado"      },
	{ label: "Bebés",            filter: "bebes"        },
	{ label: "Ofertas",          filter: "ofertas"      },
];

const THUMB_CLASS: Record<ThumbVariant, string> = {
	green:   styles.catThumbGreen,
	blue:    styles.catThumbBlue,
	accent:  styles.catThumbAccent,
	default: "",
};

function chipCount(filter: string): number {
	if (filter === "all") return CATEGORIES.length;
	return CATEGORIES.filter((c) => c.tags.includes(filter)).length;
}

export default function CatalogSection() {
	const [activeFilter, setActiveFilter] = useState("all");

	const visible =
		activeFilter === "all"
			? CATEGORIES
			: CATEGORIES.filter((c) => c.tags.includes(activeFilter));

	return (
		<section className={styles.section}>
			{/* ── Section header ─────────────────────────────── */}
			<div className={styles.sectHead}>
				<div>
					<p className={styles.sectLabel}>Catálogo</p>
					<h2 className={styles.sectTitle}>
						Encontrá lo que necesitás, rápido.
					</h2>
					<p className={styles.sectSub}>
						Desde medicamentos hasta cuidado diario. Filtrá por área para ir
						directo.
					</p>
				</div>
			</div>

			{/* ── Filter chips ────────────────────────────────── */}
			<div
				className={styles.filterRow}
				role="group"
				aria-label="Filtrar categorías"
			>
				{CHIPS.map(({ label, filter }) => (
					<button
						key={filter}
						type="button"
						className={`${styles.chip} ${activeFilter === filter ? styles.chipActive : ""}`}
						onClick={() => setActiveFilter(filter)}
					>
						{label}
						<span className={styles.chipCount}>{chipCount(filter)}</span>
					</button>
				))}
			</div>

			{/* ── Grid ────────────────────────────────────────── */}
			<div className={styles.catGrid}>
				{visible.map(({ name, slug, svg, tags, thumbVariant, badge }) => {
					const count = countProductsByCategory(slug);
					const countLabel =
						count > 0
							? `${count} producto${count !== 1 ? "s" : ""}`
							: "Ver todo";

					return (
						<Link
							key={slug}
							href={`/${slug}`}
							className={styles.cat}
							data-tag={tags.join(" ") || undefined}
						>
							<div
								className={`${styles.catThumb} ${THUMB_CLASS[thumbVariant]}`}
							>
								{svg && (
									<img
										src={`/images/categories/${svg}`}
										alt=""
										aria-hidden="true"
										className={styles.catThumbImg}
									/>
								)}
								{badge && <span className={styles.catTag}>{badge}</span>}
							</div>

							<div className={styles.catMeta}>
								<div>
									<div className={styles.catName}>{name}</div>
									<div className={styles.catCount}>{countLabel}</div>
								</div>
								<span className={styles.catArrow} aria-hidden="true">
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.4"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M5 12h14M13 5l7 7-7 7" />
									</svg>
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
