
## Cleanup Plan

Execution order for implementation passes. Run validation after each pass unless noted otherwise.

### Pass 1 - Docs and config drift
- [x] Update `AGENTS.md`
- [x] In `AGENTS.md`, fix route inventory to match `src/app/`
- [x] In `AGENTS.md`, replace old route names (`/contacto`, `/ofertas`) with current routes (`/contact`, `/offers`)
- [x] In `AGENTS.md`, remove references to nonexistent files such as `src/layout/breadcrumb/index.tsx` if still present
- [x] Update `README.md`
- [x] In `README.md`, remove outdated WhatsApp image-upload flow description
- [x] In `README.md`, remove `WHATSAPP_ORDER_IMAGE_TEMPLATE_NAME`
- [x] In `README.md`, update `/orders` behavior to match `src/app/api/whatsapp/orders/route.ts`
- [x] In `README.md`, keep deployment/runtime notes that still match the repo
- [x] Update `TODO.md` future notes that still describe click-to-chat as current behavior
- [x] Review `src/env.d.ts`
- [x] In `src/env.d.ts`, remove stale env declarations that are only tied to discarded legacy work
- [x] In `src/env.d.ts`, confirm remaining env vars match current runtime usage
- Validate with `npm run lint`
- Validate with `npm run build`

### Pass 2 - Contentful legacy cleanup
- [x] Delete `src/services/contentful/client.ts`
- [x] Delete `src/services/contentful/categories.ts`
- [x] Delete `src/tests/integration/contentful.test.ts`
- [x] Delete `src/tests/fixtures/contentful-categories.json`
- [x] Delete `src/config/index.ts` if no longer needed by any runtime code after Contentful removal
- [x] Remove Contentful env vars from `src/env.d.ts` if nothing references them anymore
- [x] Remove `contentful` from `package.json` dependencies
- [x] Check docs for any remaining Contentful references and remove or rewrite them
- [x] Review `TODO.md` for remaining Contentful references and remove or rewrite them
- [x] Review `README.md` for remaining Contentful references and remove or rewrite them
- [x] Review ADR/TODO notes that present Contentful as active work rather than discarded legacy
- Validate with `npm run fallow:audit`
- Validate with `npm run lint`
- Validate with `npm test`
- Validate with `npm run build`

### Pass 3 - Redirect and legacy route cleanup
- [ ] Update internal links that still rely on removed Spanish routes
- [ ] Update `src/layout/navbar/components/drawer/drawer.tsx`
- [ ] Review tests that encode old Spanish route assumptions
- [ ] Review `src/tests/unit/routes.test.ts`
- [ ] Remove legacy redirects from `next.config.ts`
- [ ] Remove `/contacto -> /contact` from `next.config.ts`
- [ ] Remove `/ofertas -> /offers` from `next.config.ts`
- [ ] Remove `/reservas -> /orders` from `next.config.ts`
- [ ] Remove `/medicamentos/venta-bajo-receta -> /orders` from `next.config.ts`
- [ ] Review copy/docs for references to old route names and update as needed
- Validate with `npm run fallow:audit`
- Validate with `npm run lint`
- Validate with `npm test`
- Validate with `npm run build`

### Pass 4 - Slug helper consolidation
- [ ] Consolidate duplicate slug logic into one shared utility
- [ ] Current duplicate files are `src/helpers/routes.ts` and `src/utils/nameToSlug.ts`
- [ ] Update imports to use the chosen single source
- [ ] Review `src/layout/navbar/navbar.tsx`
- [ ] Review `src/layout/navbar/components/drawer/drawer.tsx`
- [ ] Review `src/components/SubCategoryGrid/SubCategoryGrid.tsx`
- [ ] Review `src/components/ProductCatalog/ProductCatalog.tsx`
- [ ] Review `src/app/[category]/page.tsx`
- [ ] Review `src/app/[category]/[subcategory]/page.tsx`
- [ ] Review `src/app/sitemap.ts`
- [ ] Delete the now-unused duplicate helper
- [ ] Update related tests
- [ ] Update `src/tests/unit/routes.test.ts`
- Validate with `npm run fallow:audit`
- Validate with `npm run lint`
- Validate with `npm test`
- Validate with `npm run build`

### Pass 5 - Unused asset cleanup
- [ ] Reconfirm there are no runtime references to these category assets
- [ ] Reconfirm `public/images/categories/cat-sun.svg` is unused
- [ ] Reconfirm `public/images/categories/cat-protein.svg` is unused
- [ ] Reconfirm `public/images/categories/cat-receta.svg` is unused
- [ ] Reconfirm `public/images/categories/cat-diapers.svg` is unused
- [ ] Reconfirm `public/images/categories/cat-firstaid.svg` is unused
- [ ] Reconfirm `public/images/categories/cat-chronic.svg` is unused
- [ ] Reconfirm `public/images/categories/cat-intimate.svg` is unused
- [ ] Delete the confirmed-unused assets
- Validate with `npm run fallow:audit`
- Validate with `npm run build`

### Pass 6 - Optional tooling/config cleanup
- [ ] Review whether these are still intentionally used
- [ ] Review `package.json` script `deploy:dev`
- [ ] Review `package.json` script `cf-typegen`
- [ ] Review `wrangler.jsonc` entries that assume missing local setup
- [ ] If unused, remove stale scripts/docs and keep only supported deploy flows
- Validate with `npm run lint`
- Validate with `npm run build`

## Explicit decisions for this cleanup
- Keep `/dashboard` in place for now. It is still relevant as a POC/reference.
- Treat Contentful integration as discarded legacy and remove it.
- Remove legacy redirects rather than preserving them for backward compatibility.

## Deferred work
- Admin dashboard remains future work, but not part of this cleanup pass.
- Any SEO strategy decision around removed legacy routes should be handled separately from code cleanup if needed.
