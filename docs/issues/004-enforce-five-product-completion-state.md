## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Complete the selection-limit journey across the catalog. When the fifth distinct product is added, both responsive inquiry controls and every affected product action must communicate that the inquiry is complete. When a product is later removed in the basket, the catalog must become selectable again from the shared persisted state.

This is a boundary-state slice, not a quantity or inventory feature. Preserve the five-distinct-product rule and the selected-product behavior already delivered by the prerequisite slices.

## Acceptance criteria

- [ ] Adding the fifth distinct product succeeds and persists exactly five products.
- [ ] The mobile inquiry action reads “Consulta completa,” communicates “5 de 5,” and continues to offer review of the inquiry.
- [ ] The desktop inquiry control communicates the corresponding complete five-of-five state.
- [ ] Every already-selected product remains disabled as “Agregado ✓”.
- [ ] Every unselected product action becomes disabled and visibly explains “Máximo alcanzado.”
- [ ] Unselected disabled actions expose an accessible explanation that the customer can remove a basket item to select another.
- [ ] Attempting to add a sixth distinct product cannot mutate browser storage.
- [ ] The limit state is announced politely without repeatedly announcing on unrelated renders.
- [ ] After a product is removed from the basket, unselected catalog actions return to “Agregar” and the persistent controls return to the non-complete count state.
- [ ] Reloading with five stored products reconstructs the complete state correctly.
- [ ] Unit tests cover the exact boundary at four, five, and six attempted distinct products.
- [ ] End-to-end tests cover the fifth addition, both responsive complete-state labels, rejected further addition, accessible explanation, reload, and restored availability after removal.
- [ ] Quantities, duplicate lines, automatic navigation, and removal from catalog cards are not introduced.

## Blocked by

- Blocked by `issues/001-persist-selections-and-confirm-additions.md`
- Blocked by `issues/002-add-mobile-catalog-inquiry-action.md`
- Blocked by `issues/003-add-desktop-catalog-inquiry-control.md`

## User stories addressed

- User stories 18–21
- User story 35

## STATUS

DONE — implemented and verified on 2026-09-13.
