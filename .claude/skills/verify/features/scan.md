# Skin scan

A customer opens `/scan`, takes or picks a photo, and chooses `Analizar`. The page posts the photo to `/api/scan`, which calls OpenAI. The result streams back as NDJSON and renders progressively: a summary, a medical-check notice, visible patterns, and cosmetic suggestions. A suggestion that matches a pattern in `src/services/catalog/data/scan-guide.json` shows links to its catalog products under `En nuestra farmacia`.

## Sub-features

- `scan-open`: the disclaimer (`No reemplaza una consulta profesional`) and the photo tips (`Luz natural · de frente · sin maquillaje`) render.
- `scan-pick`: choosing a file shows the `Foto seleccionada` preview and the privacy note `tu foto se envía para analizarla y no se guarda`. Nothing is uploaded yet.
- `scan-analyze`: `Analizar` streams the result. The summary, patterns and solutions appear in order.
- `scan-medical-check`: when `medicalCheckFirst.suggested` is true, a notice with the reason appears.
- `scan-reject`: a non-image file or a file over 10 MB is rejected with an error.
- `scan-failure`: an OpenAI failure shows an `analysis_failed` error state.

## How to get to it (user POV)

- Open `/scan` directly. The page is not linked from the main nav, so check `aria` on `/` before claiming another entry point.
- The page is designed mobile first: run `$B viewport 412 915` before driving it.

## Driving it with browser.mjs

Preconditions:

- Doctor is all `ok`.
- The `fixtures/scan-result.json` file is in place. All of its strings start with `Verify:`.

- **Open.** Run `$B viewport 412 915` and `$B goto /scan`. `$B expect --text "Luz natural · de frente · sin maquillaje"` passes.
- **Pick.** Run `$B upload --label "Elegir una foto" --file e2e/fixtures/skin-photo.jpg`. `$B expect --role img --name "Foto seleccionada"` passes, and `curl -s http://127.0.0.1:4311/health` still shows `openai: 0` for this attempt.
- **Analyze.** Run `$B click --role button --name "Analizar"`, then `$B expect --text "Verify: protector solar FPS 50" --timeout 30000`. The fixture maps `Verify: limpiador suave` to the guide id `brillo-y-sebo`, so `$B expect --role link --name "Agua Micelar Sensibio H2O 500ml"` passes and the link points to `/dermocosmetica?sc=rostro&f=limpieza`. `Verify: protector solar FPS 50` has a null id and shows no product link. Then run `$B screenshot scan-result --full`.
- **Side effect.** The last line of `openai-requests.ndjson` shows:
  - model `gpt-5.6-luna`
  - `store: false`
  - an `input_image` whose data URL starts with `data:image/jpeg;base64`
- **Failure.** Run `curl -X POST http://127.0.0.1:4311/__control/fail-next/openai`, pick the photo again, and analyze. An error state appears instead of results.

## Gotchas

- `network.ndjson` cannot read the streamed `/api/scan` body: the page's reader consumes it. Prove the result from the rendered page and from `openai-requests.ndjson`.
- The fake streams in 24-character chunks every 40 ms, about 1 second in total. This is enough to see progressive rendering, but much faster than the real model.
- Picking a new photo, or leaving the page, aborts the request on purpose.
- To prove behavior with a different model output (for example `medicalCheckFirst.suggested: true`), edit `fixtures/scan-result.json` for the run and restore it afterwards. Report that the output was canned.
