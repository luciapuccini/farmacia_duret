# AI Agent context for this project

## Project overview

- This is a **Next.js App Router** project (React 19 + TypeScript). 
- We style with plain sass modules. Design tokens and reusable mixins live in globals.scss
- Hosted on Cloudflare Pages via `@opennextjs/cloudflare`.
- Catalog data (products and categories) will come from a call to an API. [TBD] Rest with non relational data potentially -> R2
- public customer facing flows only. No auth needed here


## Structure to follow - where does each thing live?

### Pages -- Routes
Pages live in the `src/app/` directory using Next.js file-system routing:

- `src/app/page.tsx` — Home page
- `src/app/contact/page.tsx` — Static contact page
- `src/app/offers/page.tsx` — Static offers page
- `src/app/orders/page.tsx` — Client component (`'use client'`) with order submission form that posts to `/api/whatsapp/orders`
- `src/app/dashboard/page.tsx` — Dashboard POC kept as internal reference for now
- `src/app/[category]/page.tsx` — Dynamic category page (renders `SubCategoryGrid`)
- `src/app/[category]/[subcategory]/page.tsx` — Dynamic subcategory page (renders `ProductCatalog`)
- `src/app/api/whatsapp/orders/route.ts` — Sends WhatsApp order template messages
- `src/app/api/whatsapp/webhook/route.ts` — Meta WhatsApp webhook verification + event receiver
- `src/app/not-found.tsx` — 404 page

Each page has its `.module.scss` file alongside it in the same directory.

### Component Structure
Every component follows the same named-folder structure:

- Create a folder named after the component.
- Inside that folder, create `<component_name>.tsx` for the React component.
- Inside that folder, create `<component_name>.module.scss` for the component styles.
- Import the CSS module from the component's own folder.

This rule applies to reusable components, layout components, and page-local nested components under a route's `components/` folder.

For parent components with sub-components:

- A `components` folder immediately within the parent component's directory contains all sub-components.
- Each sub-component follows the same named-folder structure.

Example:

```
src/layout/navbar/
  navbar.tsx
  navbar.module.scss
  components/
    drawer/
      drawer.tsx
      drawer.module.scss
```

Next.js route files are the exception to this naming rule: pages, layouts, route handlers, metadata files, and special files keep their framework-required names such as `page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`, `robots.ts`, and `sitemap.ts`. Route-level `.module.scss` files may stay alongside the route file.


### Utilities
Shared utility functions are in `src/utils/`.

- `nameToSlug.ts` — slug helper for category and subcategory URLs
- `safeJsonLd.ts` — JSON-LD escaping helper

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
### Typescript helpers
Typescript utility functions are in `src/utils/`:
[TBD] I'd like `src/types` in the future
[TBD] need the schema definition -- will live close to this
[TBD] add a schema validation layer to validate input data -- zod 

### How does this project get data?
- Static catalog data currently lives under `src/data/` as local JSON fixtures.
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
- This is a humble, friendly and people-first thustworthy pharmacy. Our wording should always reflect that
- Content is in Spanish, ARG 

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`luciapuccini/farmacia_duret`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

`docs/` at the repo root. See `docs/agents/domain.md`.
