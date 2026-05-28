
## Cleanup Plan -- 







### FEATURE - catalog module approach [IGNORE]
TBD - IN PROGRESS => not so good
////
## Catalog Module Refactor Plan
Goal: deepen the Catalog Module so static Catalog knowledge lives behind one Interface, while React Server Components do the static read/selection work and client code only handles filtering and navigation.
### Problem
- Catalog knowledge is fragmented across many shallow Modules.
- The current Interface leaks JSON shape, slug rules, href rules, filter derivation, and product counting into callers.
- Understanding one Catalog concept requires bouncing between:
  - `src/components/CatalogSection/CatalogSection.tsx`
  - `src/components/ProductCatalog/ProductCatalog.tsx`
  - `src/components/SubCategoryGrid/SubCategoryGrid.tsx`
  - `src/app/[category]/page.tsx`
  - `src/app/[category]/[subcategory]/page.tsx`
  - `src/app/sitemap.ts`
  - `src/layout/navbar/navbar.tsx`
  - `src/layout/navbar/components/drawer/drawer.tsx`
  - `src/utils/countProducts.ts`
  - `src/data/categories.json`
  - `src/data/products.json`
- The Catalog Module should be static-first. Only filtering and navigation should remain client-side.
### Target shape
- Add one deep Catalog Module behind a clear Seam.
- The Catalog Module owns:
  - fixture loading
  - slug normalization usage
  - Catalog href construction
  - category and subcategory lookup
  - product counting
  - filter derivation
  - CatalogSection presentation metadata
  - sitemap route derivation
- React Server Components should call the Catalog Module directly for static lookups and route validation.
- Client Modules should only receive the data needed for interaction:
  - active filter state
  - filter options
  - filtered products or product slices
  - navigation callbacks / URL updates
### Proposed Module
- Create `src/catalog/` as the Catalog Module.
- Initial candidates:
  - `src/catalog/catalog.ts`
  - `src/catalog/catalog.types.ts` only if the types become large enough to justify their own Module
  - keep `src/utils/nameToSlug.ts` as a low-level utility unless the slug rules become Catalog-specific enough to move behind the Catalog Interface
### Pass 1 - Build the Catalog Module Interface
- Add a Catalog Module with server-safe selectors/builders for static Catalog data.
- Candidate Interface:
  - `getCatalogHomeSections()`
  - `getCategoryBySlug(slug)`
  - `getSubcategoryBySlug(categorySlug, subcategorySlug)`
  - `getCatalogFilters(categorySlug, subcategorySlug)`
  - `getCatalogProducts(categorySlug, subcategorySlug, filterSlug?)`
  - `countProductsByCategory(categorySlug)`
  - `getCatalogNavCategories()`
  - `getCatalogSitemapEntries()`
  - `catalogHref(...)`
- Keep the Interface small. The point is Leverage and Locality, not exposing every intermediate step.
### Pass 2 - Move static route work into RSC
- Refactor `src/app/[category]/page.tsx`
  - replace direct JSON lookup with `getCategoryBySlug`
- Refactor `src/app/[category]/[subcategory]/page.tsx`
  - replace direct JSON lookup with `getSubcategoryBySlug`
- Refactor `src/app/sitemap.ts`
  - replace direct JSON traversal with `getCatalogSitemapEntries`
- If useful, move Home route Catalog bootstrapping to RSC too:
  - `src/app/page.tsx`
  - pass prepared CatalogSection data into a smaller client Module
### Pass 3 - Shrink client Modules to interaction-only
- Refactor `src/components/CatalogSection/CatalogSection.tsx`
  - remove embedded `CATEGORIES` and `CHIPS`
  - receive prepared section data from the Catalog Module
  - keep only chip state and UI interaction if still needed client-side
- Refactor `src/components/ProductCatalog/ProductCatalog.tsx`
  - remove direct JSON reads and inline filter derivation
  - separate static Catalog read from client filtering/navigation
  - likely split into:
    - one RSC-facing Module that prepares products + filters
    - one small client Module for query-param filter interaction
- Refactor `src/components/SubCategoryGrid/SubCategoryGrid.tsx`
  - stop constructing hrefs ad hoc if the Catalog Module can provide them
### Pass 4 - Remove duplicated Catalog knowledge from navigation
- Refactor `src/layout/navbar/navbar.tsx`
- Refactor `src/layout/navbar/components/drawer/drawer.tsx`
- Replace local category filtering and href knowledge with Catalog Module selectors/builders.
- Example: `getCatalogNavCategories()` should hide route-specific exclusions like `Ofertas` behind the Catalog Interface if that rule is truly Catalog knowledge.
### Pass 5 - Delete obsolete shallow Modules
- Delete `src/utils/countProducts.ts` after the counting logic moves behind the Catalog Module.
- Remove any now-unused local types duplicated from catalog JSON shape.
- Remove remaining direct imports of:
  - `src/data/categories.json`
  - `src/data/products.json`
  from callers that should go through the Catalog Seam instead.
### Testing plan
- Add focused tests for the Catalog Module Interface.
- Candidate test surfaces:
  - category lookup by slug
  - subcategory lookup by slug
  - filter derivation
  - product counting
  - href construction
  - sitemap entry derivation
  - exclusion rules for navigation/home sections
- After that, page tests can stay thinner:
  - route returns notFound for invalid Catalog paths
  - client filter Module only tests interaction and query-param updates
- The Interface is the test surface. Avoid tests that need to know internal JSON traversal details.
### Benefits
- More Depth: a lot of Catalog behavior behind a small Interface.
- More Leverage: pages, navbar, sitemap, and home Catalog UI all consume one Module.
- More Locality: Catalog rules change in one place instead of across many callers.
- Better AI-navigability: one obvious seam for “how Catalog works”.
- Better RSC usage: static Catalog reads happen server-side, while client Modules keep only interaction logic.
### Validation
- `npm run fallow:audit`
- `npm run lint`
- `npm test`
- `npm run build`
### Open question
- Decide whether `Ofertas` belongs inside the Catalog Module as a Catalog concept or should remain a separate marketing route with only a light link from the Catalog Interface.
One recommendation before implementation:
- Make CatalogSection data-prepared by an RSC parent, rather than letting the client Module keep the current embedded CATEGORIES config. That gives the biggest Depth gain fastest.
One open question:
- Do you want Ofertas modeled as part of the Catalog Module, or treated as a separate Module that only shares navigation placement?

-----

## Explicit decisions for this cleanup
- Keep `/dashboard` in place for now. It is still relevant as a POC/reference.
- Treat Contentful integration as discarded legacy and remove it.
- Remove legacy redirects rather than preserving them for backward compatibility.

## Deferred work
- Admin dashboard remains future work, but not part of this cleanup pass.
- Any SEO strategy decision around removed legacy routes should be handled separately from code cleanup if needed.
### END FEATURE - catalog module approach [IGNORE]