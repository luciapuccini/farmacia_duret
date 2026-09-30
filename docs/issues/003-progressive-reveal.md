# 003 — Progressive reveal

## Parent PRD

`docs/issues/prd.md`

## What to build

Show each result item as soon as it is complete, instead of at the end. Replace the fake timed steps with an honest waiting state.

- **Completion extractor** (PRD "Completion extractor"): a pure function. It takes the accumulated JSON text snapshot and the counts of items already emitted, and returns only the newly completed items as scan events. It uses the partial JSON parser from the OpenAI SDK vendored folder, imported in this module only. Completion rules: a scalar is complete when a later key exists; an array element is complete when a later element or a later key exists; the last field is completed by the final response; no item is emitted twice.
- **Route change:** on each text delta, run the extractor on the snapshot, validate each new item with its sub-schema, and write the events. At the end, validate the full response, emit any remaining items, then `done`.
- **Waiting and streaming UI** (PRD "Presentational components"): before the first item, "Analizando tu foto…" with a spinner and a summary skeleton. Items fade in, with no animation for `prefers-reduced-motion`. "Preparando más sugerencias…" under the last item until `done`.
- **Removals:** the fake analysis steps, their timer, and the progress component.

Design inspiration: `docs/design/scan_farma_mock.png`, second screen ("Estamos mirando tu foto", the photo on top, and the soft "Mientras tanto" card with a spinner). Use it as inspiration only. The mock shows timed steps ("Foto recibida", "Observando textura y tono", "Preparando tu rutina"). We do **not** build those steps, because they do not show real progress. We use the honest waiting state from the PRD. The "Mientras tanto" card is a good idea for the silent period before the first item, if it fits the waiting state.

## Acceptance criteria

- [ ] "Analizando tu foto…" and a summary skeleton show right after "Analizar".
- [ ] The summary shows when it is complete, before the rest of the answer arrives.
- [ ] The medical caution shows before any pattern or solution.
- [ ] Each pattern and each solution shows as a complete item. There is never half a sentence.
- [ ] "Preparando más sugerencias…" shows under the last item while streaming, and goes away at `done`.
- [ ] With `prefers-reduced-motion`, items appear with no animation.
- [ ] Each streamed item passes its sub-schema check before it is sent. `done` is sent only after the full schema check.
- [ ] The vendored partial JSON parser is imported in the extractor module only.
- [ ] Fake steps, their timer and the progress component are removed.
- [ ] Unit tests for the extractor: half summary emits nothing; summary emits when the next key starts; array element emits when the next element starts; last array element emits when the next key starts; no duplicates across consecutive snapshots; items in schema order.
- [ ] The e2e from `002` still passes.
- [ ] `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e` and `npm run build` pass.

## Blocked by

- Blocked by `docs/issues/002-real-photo-upload-end-to-end.md`

## User stories addressed

- User stories 13, 14, 15, 16, 17, 18, 19, 20
- User story 22
- User story 33
- User story 38

## STATUS

TODO
