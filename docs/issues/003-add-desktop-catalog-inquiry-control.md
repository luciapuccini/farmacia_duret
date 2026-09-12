## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Deliver persistent basket access for desktop catalog customers by integrating a compact inquiry control into the existing sticky navigation. The control should appear only after a product is selected, show selection progress, and remain reachable while the product grid scrolls.

Use the same observable basket snapshot as the product action and keep the control scoped to catalog routes. Preserve the current navigation hierarchy and avoid turning this slice into a broader navbar redesign.

## Acceptance criteria

- [ ] No desktop inquiry control is shown when the basket is empty.
- [ ] The first successful product addition reveals a compact inquiry control in the sticky desktop navigation.
- [ ] For one through four products, the control communicates “Consulta” and the current count out of five.
- [ ] Activating the control navigates to the existing basket route.
- [ ] The control remains available while the desktop catalog viewport scrolls.
- [ ] The control observes the shared basket snapshot and updates without independent count state.
- [ ] The control appears only at the project’s desktop catalog breakpoint.
- [ ] The control is absent from the basket, home, contact, separate order flow, and every other non-catalog route.
- [ ] The navigation’s existing information hierarchy and unrelated actions remain intact.
- [ ] The control has a meaningful accessible name, visible keyboard focus, and a minimum 44-by-44-pixel interaction area.
- [ ] Its first entrance uses the agreed restrained opacity-and-transform motion, and later count changes use the fast feedback timing.
- [ ] Reduced-motion preferences preserve the final state without spatial movement.
- [ ] End-to-end tests cover empty and non-empty visibility, count updates, navigation, sticky behavior, breakpoint behavior, route scoping, and keyboard access.
- [ ] No global basket control is introduced outside the catalog experience.

## Blocked by

- Blocked by `issues/001-persist-selections-and-confirm-additions.md`

## User stories addressed

- User stories 17–18
- User stories 21–22
- User stories 53–55

## STATUS

TODO — mark as DONE once implemented successfully and validated with the user.
