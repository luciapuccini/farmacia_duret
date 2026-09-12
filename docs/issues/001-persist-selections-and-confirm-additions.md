## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Deliver the first complete catalog-selection path from a product action to persisted browser state and back to visible UI feedback. Treat the basket domain as a deep, observable module so every later catalog and basket surface can consume the same validated snapshot and add outcomes. A selected product must remain selected after navigation or reload without creating a hydration mismatch or misleading empty-state flash.

Keep this slice limited to basket behavior and the product action. Do not add the mobile or desktop persistent inquiry controls yet, and do not redesign the product card. Follow the parent PRD’s Solution and Implementation Decisions for inquiry terminology, disabled selected state, accessible announcements, and restrained CSS-only motion.

## Acceptance criteria

- [ ] The basket domain exposes a stable way to read the current validated snapshot and subscribe to changes.
- [ ] Adding, removing, and clearing products notify all active subscribers through the same state source.
- [ ] The add operation distinguishes successful addition, already-selected product, and five-product limit outcomes without mutating storage for rejected additions.
- [ ] Missing, malformed, or schema-invalid browser storage resolves safely to an empty basket.
- [ ] Products remain unique by product ID and quantities are not introduced.
- [ ] An unselected catalog product exposes an “Agregar” action.
- [ ] Selecting a product persists it and changes the originating action to disabled “Agregado ✓”.
- [ ] Clicking the selected action again cannot remove or duplicate the product.
- [ ] Previously selected products render as “Agregado ✓” after navigation and browser reload.
- [ ] The initial client render does not cause a hydration error or visibly flash an incorrect selected state.
- [ ] Successful selection is announced through a polite live region.
- [ ] The visible label and checkmark change uses a restrained 120 ms CSS transition without bounce, overshoot, or layout shift.
- [ ] Reduced-motion preferences deliver the final selected state without spatial movement.
- [ ] The new or modified action retains visible keyboard focus and a minimum 44-by-44-pixel touch target.
- [ ] Unit tests cover basket snapshots, subscription, addition outcomes, duplicate prevention, the limit response, removal, clearing, and invalid stored data.
- [ ] End-to-end coverage verifies addition, persistence, reload behavior, disabled selected state, and accessible confirmation.
- [ ] The product-card composition, grid, filters, and responsive column counts remain unchanged.
- [ ] No runtime dependency is added.

## Blocked by

None - can start immediately.

## User stories addressed

- User story 1
- User story 3
- User stories 10–13
- User story 21
- User stories 53–55

## STATUS

TODO — mark as DONE once implemented successfully and validated with the user.
