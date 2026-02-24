## Page Structure

For each page, we adhere to the following folder structure:

- A `page` folder which contains:
  - `index.tsx`: The React component of the page.
  - `.module.scss`: The CSS module for styling the component.

This structure ensures a consistent and organized approach to building our application's interface. Each page's style and functionality are encapsulated, making the components easily maintainable and scalable.

## Component Structure

For parent components with sub-components:

- A `components` folder immediately within the parent component's directory contains all sub-components.
- Each sub-component follows the same folder structure as its parent:
  - `index.tsx`: The React component.
  - `.module.scss`: The CSS module for styling.

Example structure for a parent component with sub-components:

```
src/layout/navbar/
  index.tsx
  navbar.module.scss
  components/
    drawer/
      index.tsx
      drawer.module.scss
    searchBar/
      index.tsx
      searchBar.module.scss
```

This convention keeps related components organized together and makes it easy to locate and maintain sub-components close to their parent implementation.

## Helper Hooks and Utilities

Custom React hooks and utility functions should be organized in `/src/helpers`:

- Create hook files in `src/helpers/` with descriptive names like `hooks.ts`, `utils.ts`, etc.
- Group related helpers together (e.g., all custom hooks in `hooks.ts`)
- Always include JSDoc comments explaining the purpose and parameters
- Import helpers using absolute paths: `import { useMediaQuery } from '@/helpers/hooks'`

Example:

```typescript
// src/helpers/hooks.ts
export function useMediaQuery(query: string): boolean {
  // Hook implementation
}

export function useLocalStorage(key: string) {
  // Hook implementation
}
```

Then import in your components:

```typescript
import { useMediaQuery, useLocalStorage } from '@/helpers/hooks'
```

**Sass Breakpoints**

- Use the global Sass module at `src/globals.module.scss` to access responsive helpers.
- Import it in SCSS files with: `@use "@/globals.module" as g;` (same path everywhere).
- Use `@include g.up(md) { ... }` for styles that apply at and above the `md` breakpoint.
- Use `@include g.down(md) { ... }` for styles that apply below the `md` breakpoint.
 

Example:

```
.footer {
  background: #f8fafc; // mobile

  @include g.up(md) {
    background: #eef6ff; // desktop and up
  }
}
```

Example `g.down`:

```
.nav {
  background: white;

  @include g.down(md) {
    background: #f8fafc; // mobile and smaller than md
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