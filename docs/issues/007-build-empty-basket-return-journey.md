## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Deliver a purposeful empty-basket endpoint for customers who open the basket without selections or remove their final product. Replace the existing plain sentence with a light, designed state that matches the refreshed basket and offers one direct route back to the site’s existing default catalog destination.

Keep the behavior deliberately simple. Do not add history tracking, last-category persistence, a new catalog landing page, or additional calls to action.

## Acceptance criteria

- [ ] An empty basket renders a designed state headed “Todavía no agregaste productos.”
- [ ] The state briefly explains that the customer can select up to five products for a WhatsApp inquiry.
- [ ] Exactly one primary “Seguir explorando” action is presented.
- [ ] Activating “Seguir explorando” navigates to the same default destination used by the existing main catalog navigation.
- [ ] Opening the basket directly with no stored products shows the empty state without a hydration mismatch.
- [ ] Removing the final selected product transitions to the same empty state.
- [ ] The empty state is visually consistent with the basket’s light blue-and-mint consultation language.
- [ ] The action has visible keyboard focus and a minimum 44-by-44-pixel touch target.
- [ ] The state remains usable without horizontal scrolling at 320 pixels wide.
- [ ] End-to-end tests cover direct empty entry, removal of the final item, and navigation through “Seguir explorando.”
- [ ] No last catalog URL, filter, category, or scroll position is stored.
- [ ] No new catalog landing route is created.

## Blocked by

- Blocked by `issues/006-build-responsive-basket-review.md`

## User stories addressed

- User stories 36–37

## STATUS

TODO — mark as DONE once implemented successfully and validated with the user.
