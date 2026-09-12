# Skin scan experience

The `/scan` POC still analyzes `src/app/scan/young-man-portrait.jpg` with `gpt-5.6-luna` and the existing cosmetic-only prompt and structured result. The page now shows the example image, a live activity timeline, elapsed time, cancel/retry controls, and readable result cards in Argentine Spanish.

## Progress contract

`POST /api/scan` streams newline-delimited JSON to the browser. `src/services/scan/server.ts` translates OpenAI Responses API events into these application events:

| UI step                          | Trigger                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Preparamos la imagen             | The server starts preparing the fixed example image and request.                                                                            |
| Observamos los detalles visibles | OpenAI sends `response.created` or `response.in_progress`. This means the request is underway; it is not a separate vision tool completion. |
| Armamos la orientación           | The first `response.output_text.delta` arrives: the model has started returning the structured answer.                                      |
| Completed result                 | The SDK stream ends with status `completed` and the full result passes the Zod schema.                                                      |

The application exposes broad processing stages, not a model's private reasoning or claims about individual image regions. No extra model/tool calls, synthetic progress percentages, or timed stage transitions are used. Elapsed time reflects the actual wait; a message after 25 seconds offers the option to keep waiting or cancel.

## Completion and recovery

Partial JSON and cosmetic guidance are held until the entire result is validated. If the result calls for professional review, that guidance is prominent and cosmetic option cards are withheld. The original limited-photo disclaimer remains visible.

Cancellation and disconnection abort the upstream request. There is a 90-second server deadline and a 100-second browser fallback. Failed, refused, incomplete, malformed, and prematurely ended streams produce a retryable error. Retries clear previous state and ignore stale requests. OpenAI storage remains disabled (`store: false`), stream responses use `no-store`, and raw model events and upstream error details are not sent to the browser.

## Verification

- Unit tests: `src/tests/unit/scan-route.test.ts` and `src/tests/unit/scan-client.test.ts` cover event mapping, split JSON/UTF-8 chunks, final validation, cancellation, timeouts, failure/refusal, and cross-origin submissions.
- Browser tests: `e2e/scan.spec.ts` uses controlled streamed fixtures to cover waiting stages, completion, cancel/retry, long waits, professional-review results, mobile layout, and reduced motion. These tests make no live OpenAI calls.

References: [OpenAI streaming responses](https://developers.openai.com/api/docs/guides/streaming-responses), [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
