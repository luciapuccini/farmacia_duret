## Framework

This is a **Next.js App Router** project (React 19 + TypeScript). Hosted on Cloudflare Pages via `@opennextjs/cloudflare`.

## Page Structure

Pages live in the `app/` directory using Next.js file-system routing:

- `app/page.tsx` — Home page
- `app/contacto/page.tsx` — Static page
- `app/ofertas/page.tsx` — Static page
- `app/reservas/page.tsx` — Client component (`'use client'`) with form
- `app/[category]/page.tsx` — Dynamic category page (renders SubCategoryGrid)
- `app/[category]/[subcategory]/page.tsx` — Dynamic subcategory page (renders ProductCatalog)
- `app/api/reservas/route.ts` — API route for form submission + Telegram notification
- `app/not-found.tsx` — 404 page

Each page has its `.module.scss` file alongside it in the same directory.

## Component Structure

Reusable components live in `src/components/`. Layout components in `src/layout/`.

For parent components with sub-components:

- A `components` folder immediately within the parent component's directory contains all sub-components.
- Each sub-component follows the same folder structure:
  - `index.tsx`: The React component.
  - `.module.scss`: The CSS module for styling.

Example:

```
src/layout/navbar/
  index.tsx
  navbar.module.scss
  components/
    drawer/
      index.tsx
      drawer.module.scss
```

## Client vs Server Components

- Components using hooks (`useState`, `useEffect`, `usePathname`, `useSearchParams`) must have `'use client'` at the top.
- Pages that are purely presentational can be Server Components (the default).
- The Navbar, Drawer, Breadcrumb, PageHeader, and ProductCatalog are client components.

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
