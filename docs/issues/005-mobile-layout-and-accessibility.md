# 005 — Mobile-first layout and accessibility polish

## Parent PRD

`docs/issues/prd.md`

## What to build

Finish the layout for the phone first, then for desktop, and complete the accessibility rules. This slice needs a design review with the user (HITL).

- **Layout** (PRD "Layout"): one column on mobile. The main action is within thumb reach. No horizontal scroll. After "Analizar", the preview becomes a small thumbnail above the results. From the large breakpoint, two columns: the photo on one side, the results on the other side.
- **Empty state tips:** luz natural, de frente, sin maquillaje.
- **Accessibility** (PRD "Accessibility"): `aria-busy` on the results container while streaming. One polite live region announces "Análisis listo" one time at `done`.

Design inspiration: `docs/design/scan_farma_mock.png`, all three screens. Use it for spacing, type scale, the soft mint summary card with an icon, section headings, and the primary button at the bottom. Use it as inspiration only. These mock elements are **out of scope** for this PRD and must not be built:
- Product cards from the catalog ("Toleriane Sensitive", "Ver producto").
- "Consultar a la farmacia" action.
- The consent checkbox and the separate camera and gallery buttons (see `002`).
- The timed progress steps (see `003`).

Write down any of these as next-step ideas in `006`.

## Acceptance criteria

- [x] On a Pixel 7 size screen, the page has no horizontal scroll, and "Analizar" is within thumb reach.
- [x] The empty state shows the photo tips.
- [x] After "Analizar", the photo shows as a small thumbnail above the results.
- [x] At the large breakpoint, the photo and the results are in two columns.
- [x] The results container has `aria-busy="true"` while streaming, and not after.
- [x] A screen reader hears "Análisis listo" one time at `done`, and is not interrupted by each item.
- [x] The user reviewed the layout on a phone and on desktop against the mock, and approved it.
- [x] The e2e from `002` still passes.
- [x] `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e` and `npm run build` pass.

## Blocked by

- Blocked by `docs/issues/003-progressive-reveal.md`

## User stories addressed

- User story 4
- User stories 11, 12
- User stories 23, 24, 25, 26

## STATUS

DONE
