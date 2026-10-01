# 004 — Errors, retry and cancel

## Parent PRD

`docs/issues/prd.md`

## What to build

Make failures clear and stop work nobody reads. This slice can run in parallel with `003`.

- **Errors** (PRD "Scan route handler" and "Streaming event contract"): the client handles pre-stream JSON errors (400 / 413 / 500) and the mid-stream `{ type: "error", code }` event. The route emits `error` on any failure and closes the stream. The client maps each code to a Spanish message.
- **Clear on error:** on any error, remove partial results and show the error notice (`role="alert"`) with "Reintentar". "Reintentar" reuses the selected file. No automatic retries.
- **Cancel:** an `AbortController` cancels the request when the customer picks a new photo or leaves the page. The route forwards the request abort signal to the OpenAI call, so the model stops generating.

Design inspiration: `docs/design/scan_farma_mock.png` has no error screen. Keep the error notice in the same visual language (soft card, clear text, one primary action).

## Acceptance criteria

- [x] A 400, 413 or 500 answer from the route shows a Spanish error message and "Reintentar".
- [x] A mid-stream `error` event removes all partial results and shows the error with "Reintentar".
- [x] "Reintentar" sends the same photo again with no new pick.
- [x] The error notice uses `role="alert"`.
- [x] Picking a new photo during a scan cancels the running request.
- [x] Leaving the page during a scan cancels the running request.
- [x] The route passes the request abort signal to the OpenAI call.
- [x] There are no automatic retries.
- [x] `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e` and `npm run build` pass.

## Blocked by

- Blocked by `docs/issues/002-real-photo-upload-end-to-end.md`

## User stories addressed

- User stories 27, 28, 29, 30
- User story 35

## STATUS

DONE
