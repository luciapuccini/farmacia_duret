# 001 — Fixed disclaimer and new schema order

## Parent PRD

`docs/issues/prd.md`

## What to build

Change the scan result schema to the new key order and move the disclaimer from the model to the UI. This slice runs on the current demo flow. It is a small, safe step before the upload and streaming work.

- Reorder the schema: `summary` → `medicalCheckFirst` → `visiblePatterns` → `cosmeticSolutions` (see PRD "Scan result schema"). Key order is also the future reveal order.
- Remove the `disclaimer` field from the schema and remove the prompt line that asks for a disclaimer (see PRD "Prompt changes").
- Show a hardcoded Spanish disclaimer in the UI that is always visible, also before a scan.
- Render the results in the new order: summary, medical caution, patterns, solutions.

Design inspiration: `docs/design/scan_farma_mock.png`. The footer line on the first screen ("Orientación cosmética. No reemplaza una consulta profesional.") is a good reference for the tone and placement of the fixed disclaimer.

## Acceptance criteria

- [ ] The schema has no `disclaimer` field, and its keys are in the new order.
- [ ] The system prompt does not ask for a disclaimer. No other prompt rule changes.
- [ ] The disclaimer text is hardcoded in the UI and is visible in all page states.
- [ ] The demo scan still works, and the results show in the new order.
- [ ] `npm run typecheck`, `npm run lint` and `npm test` pass.

## Blocked by

None - can start immediately

## User stories addressed

- User story 21
- User story 36

## STATUS

TODO
