## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Deliver persistent access to the basket for customers browsing catalog products on a phone. Once the first product is selected, reveal one bottom action that communicates the number of selected products and takes the customer to review the inquiry. The control must stay within the catalog flow, remain usable around mobile safe areas, and never cover catalog content.

Use the shared basket snapshot from the prerequisite slice. Apply the motion and accessibility contracts in the parent PRD as part of this slice rather than deferring them to a later cleanup.

## Acceptance criteria

- [ ] No mobile inquiry action is shown when the basket is empty.
- [ ] The first successful product addition reveals the mobile inquiry action without requiring scrolling.
- [ ] For one through four products, the action communicates “n de 5 productos” and “Revisar consulta.”
- [ ] Activating the control navigates to the existing basket route.
- [ ] The control updates when the basket snapshot changes without maintaining an independent count.
- [ ] The control appears only at the project’s mobile catalog breakpoint.
- [ ] The control is absent from the basket, home, contact, separate order flow, and every other non-catalog route.
- [ ] The control provides at least a 44-pixel touch target and visible keyboard focus.
- [ ] Bottom padding accounts for `env(safe-area-inset-bottom)`.
- [ ] Catalog content reserves enough space that the control cannot cover the final product or other actions.
- [ ] The layout has no unintended horizontal scroll at 320 pixels wide.
- [ ] The control uses a single 280 ms opacity-and-transform entrance when first revealed.
- [ ] Later count changes use the fast 120 ms feedback timing without replaying the full entrance.
- [ ] Reduced-motion preferences remove spatial movement while preserving the state change and navigation.
- [ ] End-to-end tests cover empty and non-empty visibility, count updates, navigation, catalog-only scope, 320-pixel layout, and reduced motion.
- [ ] No duplicate mobile submit or basket action is introduced on the basket page.

## Blocked by

- Blocked by `issues/001-persist-selections-and-confirm-additions.md`

## User stories addressed

- User stories 14–16
- User story 18
- User stories 21–22
- User stories 53–56

## STATUS

TODO — mark as DONE once implemented successfully and validated with the user.
