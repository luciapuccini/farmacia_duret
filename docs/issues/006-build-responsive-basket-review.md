## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Replace the plain non-empty basket with a complete responsive review experience. The page should retain “Carrito” as the navigation landmark while presenting “Revisá tu consulta” as the task. Selected products must be easy to verify and remove, and the surrounding guidance must explain what happens after the inquiry is sent.

Visually, build a lighter sibling of the existing order experience using the established blue-and-mint language, numbered steps, subtle diagonal texture, and one restrained consultation-slip detail. Mobile should read as one clear sequence; desktop should separate the primary product list from a sticky light guidance panel. Submission controls are delivered by a later slice, but this issue must leave a coherent, demoable review-and-removal experience.

## Acceptance criteria

- [ ] The page retains “Carrito” as a navigation or breadcrumb landmark and uses “Revisá tu consulta” as its main task heading.
- [ ] Non-empty browser storage renders the corresponding selected products without a hydration mismatch or empty-state flash.
- [ ] Selected products appear in one clean list surface rather than separate floating cards.
- [ ] Each row shows the approved local illustration, product name as the primary identifier, relevant supporting catalog information, and one clearly named removal control.
- [ ] Product artwork never replaces or visually overpowers the product name.
- [ ] The page communicates the current number of distinct products out of five.
- [ ] The guidance explains that Farmacia Duret will confirm availability, price, and collection details through WhatsApp.
- [ ] The basket uses the established palette, typography, numbered square markers, and subtle diagonal texture without copying the dark order-page panel.
- [ ] A restrained clipped-corner, perforation, or equivalent consultation-slip detail provides the single signature decoration.
- [ ] Decorative details do not create extra interactive elements or compete with the selected-product list.
- [ ] Small screens use a single-column information order with products first.
- [ ] Larger screens use a product-list area and a lighter sticky guidance area.
- [ ] The layout does not overflow horizontally at 320 pixels or common tablet and desktop widths.
- [ ] Each removal control has a meaningful accessible name, visible focus treatment, and a minimum 44-by-44-pixel target.
- [ ] Removing a product updates persisted state and the rendered list immediately without confirmation, notice, or undo.
- [ ] Removal may use the agreed 150 ms opacity-and-transform exit without delaying state consistency.
- [ ] Reduced-motion preferences remove spatial exit movement.
- [ ] Removing a product updates the visible product count and shared basket snapshot.
- [ ] End-to-end tests cover rendering, local thumbnails, count, immediate removal, persistence, keyboard access, and representative responsive layouts.
- [ ] No quantity, pricing, total, payment, checkout, reservation guarantee, or purchase-confirmation UI is introduced.

## Blocked by

- Blocked by `issues/001-persist-selections-and-confirm-additions.md`
- Blocked by `issues/005-generate-and-integrate-product-illustrations.md`

## User stories addressed

- User story 2
- User stories 23–35
- User stories 53–56

## STATUS

DONE — implemented and verified on 2026-09-13.
