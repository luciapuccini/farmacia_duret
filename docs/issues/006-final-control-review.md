# 006 — Final control review

## Parent PRD

`docs/issues/prd.md`

## What to build

A final check of the full Scan v2 work against the PRD, before we call it done. No new features. Answer each question below in this file, with short notes and file references.

## Acceptance criteria

- [x] **On track:** every user story in the PRD is covered by a done issue (`001`–`005`), or the gap is written down here.
- [x] **Standards:** list notable files or functions that differ from the project rules in `.claude/rules` (for example new dependencies, stores, extra abstractions, tests of internals), and the decision for each.
- [x] **Side findings:** bugs and out-of-scope findings from the implementation are written down here and not actioned. Include the ideas from `docs/design/scan_farma_mock.png` that we did not build (product cards, "Consultar a la farmacia", consent checkbox, separate camera and gallery buttons, timed steps).
- [x] **Documentation:** `/docs` is consistent with the new scan feature (for example README notes, the design folder, the issue statuses).
- [ ] **Launch notes from the PRD:** the OpenAI monthly spend limit is set or planned, and the EXIF/GPS gap is still accepted.
- [x] **Next steps:** a short, ordered list of suggested next steps.
- [ ] **Manual validation:** the user tested the scan in the dev environment on a real phone (camera and gallery) and on desktop, and confirmed the result.

## Review (2026-10-01)

Branch `ai-test`, commits `31e1925`..`0a718cf`. Checks at review time: typecheck, lint, 57 unit tests, 42 e2e tests and build pass.

### On track

All 39 user stories are covered by a done issue:

| Stories | Issue | Notes |
| --- | --- | --- |
| 21, 36 | `001` | `ScanDisclaimer.tsx` is fixed UI text. The schema has no `disclaimer`. |
| 1–3, 5–10, 31, 32, 39 | `002` | `accept="image/*"`, no `capture`. `validateUpload` in `upload.ts` runs on the client and in `api/scan/route.ts`. `store: false`. |
| 13–20, 22, 33, 34, 37, 38 | `003` | `scan-extractor.ts` parses each item with its sub-schema. The route parses the full result before `done`. |
| 27–30, 35 | `004` | `ScanError.tsx`, `AbortController` in `ScanFlow.tsx`, `request.signal` passed to OpenAI. |
| 4, 11, 12, 23–26 | `005` | Tips, square preview on mobile, thumbnail, two columns, `aria-busy`, one `role="status"`. |

Gaps: none in the stories. Two points are not verified in the deployed environment:
- That Cloudflare/OpenNext fires `request.signal` when the client disconnects (story 35). Next.js on Node does.
- Camera and gallery on iOS Safari (stories 1, 2). Tested on the user's phone only.

Addition outside the PRD: auto-scroll to the latest result while the scan streams (`useFollowLatest` in `ScanResults.tsx`, commit `0a718cf`). It stops when the customer scrolls, touches the page or presses a key. Requested and validated by the user.

### Standards (`.claude/rules/developer_preferences.md`)

No new dependencies, no stores, no providers, no reducers. State is local to `ScanFlow`. Notable points:

| Where | Difference | Decision |
| --- | --- | --- |
| `scan-extractor.ts` | Imports a vendored internal file of the OpenAI SDK (`openai/_vendor/partial-json-parser/parser`). | Keep. Accepted in the PRD. It is the only import, and the extractor unit test detects a break after an SDK upgrade. |
| `ScanFlow.tsx` `ScanRequestError` | A small class, to carry the error code through `throw`. | Keep. One caller, but it is simpler than a result type through the stream reader. |
| `ScanResults.tsx` `useFollowLatest` | A local hook with one caller. | Keep. It holds the auto-scroll logic in one place and keeps `ScanResults` under the eslint complexity limit (10). |
| `ScanResults.tsx` `PatternList`, `SolutionList` | Split for the eslint complexity limit. | Keep. |
| `ScanSetup.tsx` | After "Analizar", the DOM has two `img` elements for the same photo (thumbnail with `lg:hidden`, large preview with `hidden lg:block`). Only one is visible. | Keep. CSS only, no resize listener. |
| Tests | Unit tests cover the extractor and the upload rules through their public functions. E2E tests use `page.route` mocks. No test reads internals. | OK. |

### Side findings (written down, not actioned)

Bugs and risks:
1. **The route has no automatic test against its real code.** The e2e tests mock `/api/scan`. The NDJSON writer, the 400/413/500 answers and the abort path are tested only by hand. A route test with a fake OpenAI stream is a candidate next step.
2. **The server trusts the MIME type that the browser sends.** `validateUpload` checks `file.type` and `file.size`, not the file bytes. A non-image with `image/jpeg` reaches OpenAI, which rejects it, and the customer sees `analysis_failed`. Low risk.
3. **`npm run test:e2e` fails locally** because `node_modules/playwright` is 1.60 and `@playwright/test` is 1.63. Workaround: start `npm run preview`, then run `node node_modules/@playwright/test/cli.js test`. Fix: a clean `npm install` (or `npm dedupe`), then check the lockfile.
4. **Secrets in the Worker bundle** (`docs/backlog/secrets-baked-into-worker-bundle.md`) also affect `OPENAI_API_KEY`. Fix it before launch.
5. **No link to `/scan`** from the navbar or the home page. The page is reachable only by URL. A product decision.
6. **During and after a scan, the "Analizando…" / "Analizar" button stays above the results.** The user approved the design, but it repeats the waiting header.
7. **Any key press stops the auto-scroll**, including Tab.
8. **Next.js renders a route announcer with `role="alert"`.** Tests must filter alerts by text (see `e2e/scan.spec.ts`).

Mock ideas from `docs/design/scan_farma_mock.png` that we did not build:
- Product cards from the catalog ("Toleriane Sensitive", "Ver producto") linked to each suggestion.
- A "Consultar a la farmacia" action (for example, the WhatsApp flow of `/orders`).
- A consent checkbox before the photo.
- Separate "Sacar foto" and "Elegir de galería" buttons.
- Timed progress steps ("Foto recibida", "Observando textura y tono", "Preparando tu rutina").
- A framing guide over the photo, and the title "Tu guía de cuidado" on the result screen.

### Documentation

- Issues `001`–`005` are DONE, with all criteria ticked.
- `README.md` had no notes for the scan. Added in this review: a "Skin scan" section (route, `OPENAI_API_KEY` secret, launch notes) and `scan/` and `api/scan/` in the project structure.
- `.env.example` and `src/env.d.ts` already have `OPENAI_API_KEY`.
- `docs/design/scan_farma_mock.png` stays as reference. The PRD is not changed.

### Launch notes from the PRD

- OpenAI monthly spend limit: **to confirm by the user** (not code; set it on the OpenAI project dashboard). There is no rate limit.
- EXIF/GPS gap: still accepted. The raw file is sent to OpenAI with `store: false`, and we store nothing.

### Next steps (suggested order)

1. Set the OpenAI monthly spend limit, and fix the secrets-in-bundle backlog item. Then deploy to staging.
2. On staging: check the cancel (OpenAI dashboard shows an early stop) and the camera and gallery flow on iOS Safari and on Android.
3. Fix the local Playwright install, so that `npm run test:e2e` works again.
4. Add a route test with a fake OpenAI stream (finding 1).
5. Decide on a link to `/scan` from the site.
6. Product ideas: catalog product cards for each suggestion, then "Consultar a la farmacia".
7. When there is traffic: a rate limit, and client-side resize with EXIF stripping.

## Blocked by

- Blocked by `docs/issues/001-fixed-disclaimer-and-schema-order.md`
- Blocked by `docs/issues/002-real-photo-upload-end-to-end.md`
- Blocked by `docs/issues/003-progressive-reveal.md`
- Blocked by `docs/issues/004-errors-retry-and-cancel.md`
- Blocked by `docs/issues/005-mobile-layout-and-accessibility.md`

## User stories addressed

- All user stories (review only)

## STATUS

TODO
