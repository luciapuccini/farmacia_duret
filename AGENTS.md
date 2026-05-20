## Framework

This is a **Next.js App Router** project (React 19 + TypeScript). Hosted on Cloudflare Pages via `@opennextjs/cloudflare`.

## Page Structure

Pages live in the `app/` directory using Next.js file-system routing:

- `app/page.tsx` — Home page
- `app/contacto/page.tsx` — Static page
- `app/ofertas/page.tsx` — Static page
- `app/orders/page.tsx` — Client component (`'use client'`) with WhatsApp handoff form
- `app/[category]/page.tsx` — Dynamic category page (renders SubCategoryGrid)
- `app/[category]/[subcategory]/page.tsx` — Dynamic subcategory page (renders ProductCatalog)
- `app/api/whatsapp/webhook/route.ts` — Meta WhatsApp webhook verification + event receiver
- `app/not-found.tsx` — 404 page

Each page has its `.module.scss` file alongside it in the same directory.

## Component Structure
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


## Helper Hooks and Utilities

Custom React hooks and utility functions are in `src/helpers/`:

- `hooks.ts` — Custom hooks like `useMediaQuery` (has `'use client'`)
- `routes.ts` — `categoryNameToPath()` slug helper

Import using absolute paths: `import { useMediaQuery } from '@/helpers/hooks'`

## Sass Breakpoints

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

## SEO Guidelines

Structured data (JSON-LD) should be implemented for improved search engine visibility:

- **Breadcrumbs**: Always include BreadcrumbList structured data when implementing breadcrumb navigation. See `src/layout/breadcrumb/index.tsx` for reference implementation.
- **Product pages**: Include Product schema when displaying products
- **Organization**: Include Organization schema in the footer or main layout
- **FAQ**: Include FAQPage schema for FAQ sections
- **LocalBusiness**: Include LocalBusiness schema with pharmacy location data

When creating new pages that would benefit from structured data, proactively suggest implementing JSON-LD schemas.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`luciapuccini/farmacia_duret`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
