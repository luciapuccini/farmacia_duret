# PRD: Scan v2 — real photo upload with progressive results

## Problem Statement

The skin scan page is a static demo. It always analyzes one bundled portrait, so a customer cannot use it on their own skin. The customer taps one button and then waits for the full answer with no real feedback. The progress steps on screen move on a timer and do not show what the analysis is actually doing. The page is not designed for the phone, but most customers will take the photo with a phone camera.

## Solution

A customer opens the scan page on their phone, takes a photo with the camera or picks one from the gallery, sees a preview, and taps "Analizar". The page shows an honest waiting state while the model thinks. After that, each result section appears as soon as it is complete: first the summary, then the medical caution if there is one, then each visible pattern, then each cosmetic suggestion. A fixed disclaimer is always visible. The photo is not stored. If something fails, the page shows a clear error and a retry button that uses the same photo.

## User Stories

1. As a customer, I want to take a photo of my skin with my phone camera from the scan page, so that I can get an analysis of my own skin.
2. As a customer, I want to pick an existing photo from my gallery, so that I can use a photo I already took in good light.
3. As a desktop customer, I want to pick a photo file from my computer, so that I can use the feature without a phone.
4. As a customer, I want to see short tips for a good photo (natural light, face the camera, no make-up) before I take it, so that the analysis is useful.
5. As a customer, I want to see a preview of the selected photo before it is sent, so that I know exactly what leaves my device.
6. As a customer, I want to change the photo before I start the analysis, so that I can fix a wrong pick without wasting a scan.
7. As a customer, I want to read a short consent line next to the "Analizar" button, so that I know my photo is sent for analysis and is not stored.
8. As a customer, I want the analysis to start only when I tap "Analizar", so that I stay in control of when my photo is sent.
9. As a customer, I want an immediate message if my file is not a JPG, PNG or WEBP image, so that I do not wait for an upload that will fail.
10. As a customer, I want an immediate message if my photo is larger than 10 MB, so that I can pick a different photo.
11. As a customer, I want the main action button within thumb reach on my phone, so that I can use the page with one hand.
12. As a customer, I want the page to fit my phone screen without horizontal scrolling, so that it is easy to read.
13. As a customer, I want to see a clear "Analizando tu foto…" state right after I tap "Analizar", so that I know the analysis started.
14. As a customer, I want a placeholder where the summary will appear, so that the layout does not jump when content arrives.
15. As a customer, I want the summary to appear as soon as it is complete, so that I do not wait for the full result to start reading.
16. As a customer, I want to see the medical caution before any product suggestion, so that I know to consult a professional before I choose a product.
17. As a customer, I want each visible pattern to appear when it is complete, so that I can read while the analysis continues.
18. As a customer, I want each cosmetic suggestion to appear as a complete card with its rationale and precautions, so that I never read half a sentence.
19. As a customer, I want an indicator below the last item while more content is coming, so that I know the analysis is not finished.
20. As a customer, I want the indicator to go away when the analysis is complete, so that I know I have the full result.
21. As a customer, I want the disclaimer to be visible at all times, so that I always know that a photo analysis is limited and does not replace a professional.
22. As a customer who prefers reduced motion, I want content to appear without animation, so that the page is comfortable for me.
23. As a screen reader user, I want the page to announce when the analysis is ready, one time, so that I am not interrupted by every new item.
24. As a screen reader user, I want the result area to be marked as busy while it streams, so that my assistive technology handles the updates correctly.
25. As a customer, I want the selected photo to stay visible as a small thumbnail above the results, so that I remember what was analyzed.
26. As a customer on desktop, I want the photo on one side and the results on the other side, so that I use the wide screen well.
27. As a customer, I want a clear error message if the analysis fails at any point, so that I know that something went wrong.
28. As a customer, I want a "Reintentar" button after an error that uses the same photo, so that I do not have to pick the photo again.
29. As a customer, I want partial results to be removed when the analysis fails, so that I do not act on an incomplete result.
30. As a customer, I want the analysis to stop when I leave the page or pick a new photo, so that no work continues for a photo I no longer want to analyze.
31. As a customer, I want my photo to be discarded after the analysis, so that my face image is not kept by the pharmacy or by the AI provider.
32. As the pharmacy, I want the server to validate the file type and size again, so that invalid or oversized uploads never reach the AI provider.
33. As the pharmacy, I want each streamed item to be validated before it is sent to the browser, so that the page never shows malformed content.
34. As the pharmacy, I want the full result to pass the complete schema check before the analysis is marked as done, so that a "done" state means a valid result.
35. As the pharmacy, I want the model to stop generating when the customer abandons the request, so that we do not pay for tokens nobody reads.
36. As the pharmacy, I want the disclaimer text to be fixed in the UI, so that it is consistent and legally predictable.
37. As a developer, I want the streaming contract to be a small set of typed events, so that the client only appends events and never parses partial JSON.
38. As a developer, I want the "which items are complete" logic in one pure function, so that I can test it with recorded snapshots.
39. As a developer, I want one validation function shared by the client and the server, so that the upload rules do not drift.

## Implementation Decisions

### Modules

- **Upload validation (deep, pure).** One function that takes a file's type and size and returns either "valid" or a specific rejection reason (unsupported type, too large). Rules: JPEG, PNG or WEBP only, 10 MB maximum, one file. The client uses it for instant feedback. The server uses it as the trust boundary. Spanish messages are mapped from the rejection reason in the UI.
- **Scan result schema.** A Zod schema with the new key order: `summary` → `medicalCheckFirst` (`suggested`, `reason` nullable) → `visiblePatterns` (strings) → `cosmeticSolutions` (`name`, `rationale`, `precautions`). The `disclaimer` field is removed. Sub-schemas for each item are used to validate single streamed items. Key order is also the reveal order, because the model writes JSON in schema order.
- **Completion extractor (deep, pure).** Takes the accumulated JSON text snapshot and the count of items already emitted, and returns only the newly completed items as scan events. It uses the partial JSON parser that the OpenAI SDK ships in its vendored folder, imported in this module only. Completion rules:
  - A scalar field is complete when a later key exists in the partial object.
  - An array element is complete when a later element or a later key exists.
  - The last field is completed by the final response, not by the extractor.
  - An item is never emitted twice.
- **Scan route handler.** `POST /api/scan`. Accepts `multipart/form-data` with one image field. Before streaming it validates the upload and the API key configuration and answers with a JSON error and an HTTP status (400 invalid input, 413 too large, 500 server configuration). After that it returns an NDJSON `ReadableStream`. It calls the OpenAI Responses streaming helper with the image as a base64 data URL, `detail: 'high'`, the same model, `reasoning.effort: 'medium'`, `store: false`, and the structured text format from the schema. It forwards the request abort signal to the OpenAI call. On each text delta it runs the completion extractor and writes the new events. At the end it validates the final parsed response against the full schema, emits any remaining items, and then emits `done`. On any failure it emits `error` and closes the stream. Runtime stays Node.js-compatible (Cloudflare Workers through OpenNext).
- **Streaming event contract (NDJSON, one JSON object per line):**
  - `{ type: "status", stage: "analyzing" }`: request accepted, the model is working.
  - `{ type: "summary", text }`
  - `{ type: "medicalCheck", suggested, reason }`
  - `{ type: "pattern", text }`: one event for each completed pattern.
  - `{ type: "solution", name, rationale, precautions }`: one event for each completed solution.
  - `{ type: "done" }`: only after the full schema check passes.
  - `{ type: "error", code }`: the client maps the code to a Spanish message.
- **Scan flow client component.** Replaces the current demo button component. It owns local state only: selected file, preview URL, status (`idle` | `selected` | `streaming` | `done` | `error`), and the accumulated result items. It reads the response body with `fetch` and a stream reader, splits lines, and appends events. An `AbortController` cancels the request when the customer picks a new photo or leaves the page. On error it clears partial results and shows the error with "Reintentar" (reuses the selected file). The preview URL is created with an object URL and revoked when it is replaced or unmounted.
- **Presentational components.**
  - Photo picker: empty state with a dashed box, tips, and the native file input `accept="image/*"` with no `capture` attribute.
  - Preview with "Analizar" and "Cambiar foto" plus the consent line.
  - Waiting state: spinner line and summary skeleton.
  - Streaming results that render each item as it arrives with a fade-in that respects `prefers-reduced-motion`, plus a "Preparando más sugerencias…" line under the last item until `done`.
  - Fixed disclaimer, always visible.
  - Error notice.
- **Accessibility.** The results container has `aria-busy` while it streams. One polite live region announces "Análisis listo" at `done`. Errors use `role="alert"`.
- **Layout.** Mobile first, one column, main action within thumb reach. After "Analizar", the preview becomes a small thumbnail above the results. From the large breakpoint, two columns: photo on one side, results on the other.

### Prompt changes

- Remove the instruction to write a disclaimer.
- No other behavior changes: no image-quality gate, same prudent non-diagnostic rules, same model and reasoning effort.

### Removals

- The server action, the fake analysis steps and their timer, the progress component, the demo image and its component, the idle overview component, the `ASSETS` fetch for the demo image, and the empty leftover folders in the scan feature.

## Testing Decisions

- Good tests check public behavior through a module's interface: input in, output out. They do not check internal state, private helpers, or how a component is built. They never call the real OpenAI API.
- **Completion extractor (unit, Vitest).** Feed recorded or hand-written JSON snapshots and check the emitted events. Cases:
  - A half-written summary emits nothing.
  - The summary is emitted when the next key starts.
  - An array element is emitted when the next element starts.
  - The last array element is emitted when the next key starts.
  - No duplicate events across consecutive snapshots.
  - Items are emitted in schema order.

  This test also detects a break in the vendored partial JSON parser import after an SDK upgrade.
- **Upload validation (unit, Vitest).** Accepts JPEG, PNG and WEBP up to 10 MB. Rejects other types (for example HEIC, PDF) and files over 10 MB with the correct reason.
- **Scan happy path (e2e, Playwright).** The spec sets a mobile device (Pixel 7) inside the file. The global config does not change. The spec:
  1. Mocks `/api/scan` with `page.route` and a canned NDJSON body.
  2. Uploads a fixture image with `setInputFiles`.
  3. Checks the preview.
  4. Taps "Analizar".
  5. Checks that summary, medical caution, patterns and solutions appear, and that the disclaimer is visible.
- Prior art:
  - Unit tests live in `src/tests/unit` (for example `basket.test.ts`, `whatsapp-webhook.test.ts`).
  - E2E route mocking follows `e2e/orders.spec.ts`, which mocks an API route with `page.route` and `route.fulfill`.

## Out of Scope

- Client-side image resizing, format conversion, or EXIF/GPS stripping. The raw file is sent.
- An in-page live camera (`getUserMedia`), a framing guide overlay, or forcing the camera with `capture`.
- An image-quality gate or a "retake photo" flow driven by the model.
- Rate limiting (per IP or global) and daily caps.
- Changes to the model or the reasoning effort, and latency or timing logs.
- Automatic retries, and keeping partial results after a mid-stream error.
- Storing photos or results, scan history, and user accounts.
- A "try with an example photo" option. The demo photo is removed.
- Token-by-token (typewriter) text rendering.

## Further Notes

- **Accepted privacy tradeoff:** the raw photo can contain EXIF metadata, including GPS location, and it is sent to OpenAI. This is covered by `store: false` and by not storing anything on our side, but it is still a known gap.
- **Accepted cost risk:** with no rate limit, OpenAI spend is exposed to abuse. A monthly spend limit on the OpenAI project dashboard is a recommended, non-code launch step.
- **Dependency risk:** the partial JSON parser is an internal, vendored file of the OpenAI SDK. The package exports allow the import, but an SDK upgrade can move it. The import is isolated in one module and covered by the extractor unit test.
- Because of `medium` reasoning, there can be a silent period of several seconds before the first item. The waiting state must make this period feel intentional.
- iOS Safari usually converts HEIC photos to JPEG for `accept="image/*"`, so the HEIC rejection should be rare.
- Personal data from real users is subject to Argentina's Ley 25.326. The consent line and the no-storage rule are the controls in this iteration.
