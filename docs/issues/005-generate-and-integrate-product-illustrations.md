## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

HITL

## What to build

Replace unstable remote sample imagery with a cohesive, locally served illustration set that can be reviewed as a whole. Generate one original raster illustration for each of the twenty current sample products and one neutral fallback. Integrate the approved set into catalog data and rendering while preserving the current product-card layout and image proportions.

The art direction should feel related to the existing friendly pharmacy illustration language and established blue-and-mint palette. Images should suggest the correct product type while remaining deliberately generic and free of branded or medically misleading details. A human visual review of the complete set is required before this issue can be marked done.

## Acceptance criteria

- [ ] Twenty distinguishable product illustrations exist, one for each current sample product.
- [ ] One neutral fallback illustration exists for future or unassigned products.
- [ ] The set uses a consistent composition, lighting treatment, background system, crop, and aspect ratio compatible with the current cards.
- [ ] Each illustration suggests the correct product type named by its catalog entry.
- [ ] No illustration contains a real or invented logo, recognizable branded packaging, trademarked trade dress, accidental legible text, dosage instructions, efficacy claims, or prescription information.
- [ ] Products with similar types remain distinguishable without implying exact packaging accuracy.
- [ ] The generated assets are optimized for web delivery at the card’s rendered sizes.
- [ ] All final image files are committed to the public static asset collection and do not require an image-generation service at runtime.
- [ ] Every current catalog product references a local illustration.
- [ ] Catalog rendering uses the neutral fallback when an image is missing or unavailable.
- [ ] Remote product-image URLs are removed from catalog data.
- [ ] Image dimensions or an equivalent stable aspect-ratio contract prevent layout shift while images load.
- [ ] Product names remain the primary source of accurate identification and retain meaningful alternative text.
- [ ] Asset provenance, generation method, and illustrative-use constraints are documented with the set.
- [ ] Automated validation confirms that all catalog references are local, all referenced files exist, the fallback exists, and no remote product-image URL remains.
- [ ] The product-card grid, content hierarchy, filters, and responsive density remain unchanged.
- [ ] A human reviews the complete set in representative catalog grids and approves visual consistency before the issue is marked DONE.

## Blocked by

None - can start immediately.

## User stories addressed

- User stories 4–9
- User stories 26–27

## STATUS

DONE — implemented and approved on 2026-09-13.
