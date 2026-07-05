# AI Agent context for this project

## Project overview

- This is a **Next.js App Router** project (React 19 + TypeScript).
- We style with **Sass modules** for custom components and **Tailwind CSS** for shadcn/ui components. Design tokens and reusable mixins live in `globals.scss`.
- Hosted on Cloudflare Pages via `@opennextjs/cloudflare`.
- Catalog data (products and categories) is currently static JSON files.
- Public customer facing flows only. No auth needed here.

## Structure to follow - where does each thing live?

### Pages -- Routes

Pages live in the `src/app/` directory using Next.js file-system routing:

- `src/app/(home)/page.tsx` — Home page
- `src/app/contact/page.tsx` — Static contact page
- `src/app/offers/page.tsx` — Static offers page
- `src/app/orders/page.tsx` — Client component (`'use client'`) with order submission form that posts to `/api/whatsapp/orders`
- `src/app/dashboard/page.tsx` — Dashboard POC kept as internal reference for now
- `src/app/(catalog)/[category]/page.tsx` — Dynamic category page (renders `SubCategoryGrid`)
- `src/app/api/whatsapp/orders/route.ts` — Sends WhatsApp order template messages
- `src/app/api/whatsapp/webhook/route.ts` — Meta WhatsApp webhook verification + event receiver
- `src/app/not-found.tsx` — 404 page

### Pages components

We use route groups (folders in parentheses) to co-locate each route with its own `components/` subfolder containing page-local components.

### UI component library

Reusable Shadcn UI components live in `src/components/ui/` as named subfolders, exported via the barrel file `src/components/ui/index.ts`.

### Styling — Sass modules vs Tailwind

Two styling systems coexist:

**Custom components** use Sass modules:

- Each component has its own `<name>.module.scss` file.
- Sass design tokens and responsive mixins come from `@use "@/globals" as g;`.
- Combine CSS Module class names with **`clsx`** — never pass `styles.*` through `cn`/`twMerge` (see rule below).

**shadcn/ui components** use Tailwind utility classes only:

- Use `cn` (from `src/utils/className.ts`) to merge Tailwind strings — it wraps `clsx` + `twMerge`.

> note: reach for tailwind first, we want to migrate progressively off sass

#### Rule: `clsx` for CSS Modules, `cn` for Tailwind

`twMerge` (inside `cn`) identifies Tailwind utilities by name pattern. Next.js CSS Module class names include the filename, e.g. `text-link_link__abc`. When the filename starts with a Tailwind prefix like `text-`, `twMerge` mistakes the scoped class for a Tailwind utility and silently drops it when any conflicting Tailwind class is also present.

```ts
// WRONG — cn/twMerge may drop the CSS Module class
className={cn(styles.link, className)}

// CORRECT — clsx just concatenates, CSS Modules are already scoped
className={clsx(styles.link, className)}

// cn is fine for pure Tailwind strings (no styles.*)
className={cn('flex items-center', className)}
```

### Sass Breakpoints

- Use the global Sass utilities at `src/globals.scss` for responsive helpers and palette.
- Import in SCSS files with: `@use "@/globals" as g;`
- Use `@include g.up(md) { ... }` for styles at and above the `md` breakpoint.
- Use `@include g.down(md) { ... }` for styles below the `md` breakpoint.
- Use `g.palette(black)`, `g.palette(white)`, etc. for theme colors.

Example:

```scss
.footer {
  background: #f8fafc;

  @include g.up(md) {
    background: #eef6ff;
  }
}
```

### Utilities

Shared utility functions are in `src/utils/`:

- `className.ts` — `cn(...)` helper: `clsx` + `twMerge` for Tailwind-only class merging
- `nameToSlug.ts` — slug helper for category and subcategory URLs
- `safeJsonLd.ts` — JSON-LD escaping helper
- `countProducts.ts` — product count helpers
- `countryCodes.ts` — country code data

### Types

Shared TypeScript types live in `src/types/types.ts`.

### Config

Site-wide configuration (name, URLs, contact info) lives in `src/config/site.ts`.

### Tests

Unit tests live in `src/tests/unit/`. files use _.test.ts
End to end test with playwrite live in `e2e`. files use _.spec.ts
filenames intentionally different match for simplicity confing between vitest vs playwright

### How does this project get data?

- Static catalog data currently lives under `src/data/` as local JSON fixtures.
- Server actions for catalog live in `src/services/actions/catalog.ts`.
- Client-server communication belongs under `src/services/` when we add external integrations.
- `src/app/api` is used for route handlers such as the current WhatsApp integration.

## SEO Guidelines

Structured data (JSON-LD) should be implemented for improved search engine visibility:

- **Breadcrumbs**: Always include BreadcrumbList structured data when implementing breadcrumb navigation.
- **Product pages**: Include Product schema when displaying products
- **Organization**: Include Organization schema in the footer or main layout
- **FAQ**: Include FAQPage schema for FAQ sections
- **LocalBusiness**: Include LocalBusiness schema with pharmacy location data

When creating new pages that would benefit from structured data, proactively suggest implementing JSON-LD schemas.

## Content guidelines

- This is a humble, friendly and people-first trustworthy pharmacy. Our wording should always reflect that.
- Content is in Spanish, ARG.

## Agent skills

### Domain docs

`docs/` at the repo root. See `docs/agents/domain.md`.
