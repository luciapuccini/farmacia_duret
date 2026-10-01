# 002 — Real photo upload, end to end

## Parent PRD

`docs/issues/prd.md`

## What to build

Replace the demo photo with a real photo from the customer. The customer picks or takes a photo, sees a preview, and taps "Analizar". The photo goes to a new streaming route, and the page renders the result. In this slice the route sends all result items at the end, after the full schema check. Progressive reveal comes in `003`.

- **Photo picker and preview** (PRD "Presentational components"): a dashed empty box with "Sacá o elegí una foto", the native file input `accept="image/*"` with no `capture` attribute, a preview after the pick, "Cambiar foto", "Analizar", and the consent line "Al tocar Analizar, tu foto se envía para analizarla y no se guarda."
- **Upload validation** (PRD "Upload validation"): one pure function, shared by the client and the server. JPEG, PNG or WEBP only, 10 MB maximum, one file. The UI maps each rejection reason to a Spanish message.
- **Scan route handler** (PRD "Scan route handler" and "Streaming event contract"): `POST /api/scan` with `multipart/form-data`. Validate before streaming (400 / 413 / 500 JSON errors). Then return NDJSON: `status` → all items from the final parsed response (`summary`, `medicalCheck`, `pattern` ×N, `solution` ×N) → `done`. Use the Responses streaming helper, the same model, `reasoning.effort: 'medium'`, `detail: 'high'`, `store: false`. Validate the final response against the full schema before `done`.
- **Scan flow client component** (PRD "Scan flow client component"): replaces the demo button component. Local state only. Reads the body with `fetch` and a stream reader, splits lines, appends events. Creates and revokes the preview object URL.
- **Removals** (PRD "Removals"): the server action, the demo image and its component, the idle overview component, the `ASSETS` fetch, the empty leftover folders.
- **Tests:** a unit test for upload validation, and the Pixel 7 e2e happy path with a mocked `/api/scan` (PRD "Testing Decisions").

Design inspiration: `docs/design/scan_farma_mock.png`, first screen (photo box with corner frame, tips caption, consent near the main button, primary button at the bottom). Use it as inspiration only. The PRD decisions win where they differ:
- The mock has a consent **checkbox**. We use a consent **line** next to "Analizar", with no checkbox.
- The mock has two buttons ("Sacar foto" / "Elegir de galería"). We use one native file input. The OS shows the camera and gallery options.

## Acceptance criteria

- [x] On a phone, the customer can take a photo with the camera or pick one from the gallery. On desktop, the customer can pick a file.
- [x] A preview shows after the pick. "Cambiar foto" replaces the photo. Nothing is sent before "Analizar".
- [x] The consent line is visible next to "Analizar".
- [x] A non-JPEG/PNG/WEBP file or a file over 10 MB shows an immediate Spanish message, and no request is sent.
- [x] The server runs the same validation and answers 400 / 413 with JSON before streaming. A missing API key answers 500.
- [x] The route answers with NDJSON events from the PRD contract, and sends `done` only after the full schema check passes.
- [x] The result renders in the order summary, medical caution, patterns, solutions. The fixed disclaimer from `001` stays visible.
- [x] Nothing is stored. `store: false` is set.
- [x] The server action, demo photo, demo image component, idle overview and `ASSETS` fetch are removed. The empty folders are removed.
- [x] Unit test: validation accepts JPEG, PNG and WEBP up to 10 MB, and rejects HEIC, PDF and files over 10 MB with the correct reason.
- [x] E2E (Pixel 7, set in the spec, no config change): mock `/api/scan` with canned NDJSON, `setInputFiles` with a fixture image, check the preview, tap "Analizar", check the four sections and the disclaimer.
- [x] `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e` and `npm run build` pass.

## Blocked by

- Blocked by `docs/issues/001-fixed-disclaimer-and-schema-order.md`

## User stories addressed

- User stories 1, 2, 3
- User stories 5, 6, 7, 8, 9, 10
- User story 31
- User story 32
- User story 34
- User story 37
- User story 39

## STATUS

DONE
