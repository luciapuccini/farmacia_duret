## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

HITL

## What to build

Run the final control pass across the completed catalog and basket inquiry experience. Compare the implemented behavior with every relevant section and user story in the parent PRD, verify the repository’s project conventions, confirm that side findings remained out of scope, and leave the documentation in a truthful final state.

This issue is a review and correction gate, not authorization for unrelated cleanup. Any divergence must be fixed when it belongs to the PRD or documented as a separate suggested next step when it does not. A human validation of the finished experience is required before marking the issue done.

## Acceptance criteria

- [ ] Every user story in the parent PRD is mapped to implemented, testable behavior or an explicitly documented unresolved exception.
- [ ] The final experience still presents a product inquiry rather than a purchase or checkout.
- [ ] Catalog changes remain limited to local imagery, add feedback, persistent catalog controls, and the five-product state.
- [ ] Basket behavior matches the approved responsive composition, lighter order-page relationship, terminology, empty state, removal behavior, submission states, and WhatsApp continuation.
- [ ] All twenty product illustrations and the fallback pass the approved visual, brand-neutrality, and misleading-content review.
- [ ] The catalog and basket are manually reviewed at 320-pixel phone, common phone, tablet, and desktop widths.
- [ ] Sticky mobile controls respect safe areas, do not obscure content, and retain minimum touch targets.
- [ ] Keyboard navigation, visible focus, accessible names, phone-error association, live announcements, and reduced-motion behavior are verified.
- [ ] Motion uses only the approved CSS timings and purposes; no new motion dependency, bounce, scroll reveal, page transition, confetti, or decorative excess was introduced.
- [ ] Unit, type, lint, build, and relevant end-to-end checks pass, or any unrelated pre-existing failure is recorded with evidence.
- [ ] Tests assert external behavior rather than component internals or styling implementation details.
- [ ] Sass-module classes use the project’s CSS-module class combiner, and Tailwind-only classes use the Tailwind merge helper.
- [ ] New styling follows the existing token system, responsive mixins, language rules, and public-facing Spanish-Argentina voice.
- [ ] No change was made to the WhatsApp template, server API contract, webhook behavior, or other out-of-scope integration.
- [ ] No quantity, price, payment, global basket control, new catalog landing page, history persistence, removal undo, error fallback, or automatic redirect was introduced.
- [ ] Bugs or improvement opportunities found outside the PRD are documented separately and were not actioned opportunistically.
- [ ] Documentation under `/docs` accurately reflects the final behavior and any approved deviations.
- [ ] Suggested next steps are listed with clear rationale and are not mixed into the completed scope.
- [ ] The final implementation is demonstrated to the user and receives explicit validation before this issue is marked DONE.

## Blocked by

- Blocked by `issues/001-persist-selections-and-confirm-additions.md`
- Blocked by `issues/002-add-mobile-catalog-inquiry-action.md`
- Blocked by `issues/003-add-desktop-catalog-inquiry-control.md`
- Blocked by `issues/004-enforce-five-product-completion-state.md`
- Blocked by `issues/005-generate-and-integrate-product-illustrations.md`
- Blocked by `issues/006-build-responsive-basket-review.md`
- Blocked by `issues/007-build-empty-basket-return-journey.md`
- Blocked by `issues/008-submit-inquiries-with-responsive-controls.md`
- Blocked by `issues/009-complete-submission-and-continue-in-whatsapp.md`

## User stories addressed

- User stories 1–56

## STATUS

DONE — implemented and validated on 2026-09-14.

## Final review record

### User-story coverage

| Stories | Verified behavior | Evidence |
| --- | --- | --- |
| 1–9 | Local, illustrative catalog artwork and fallback image | `catalog-images.test.ts`, asset review, catalog browser check |
| 10–22 | Stored selections, add feedback, limit state, and route-scoped inquiry controls | `catalogOrder.spec.ts` |
| 23–37 | Responsive basket, local thumbnails, immediate removal, and empty return path | `catalogOrder.spec.ts`, browser review |
| 38–46 | Argentine phone input, keyboard submission, sending, validation, and static failure feedback | `catalogOrder.spec.ts` |
| 47–52 | Cleared basket, persistent success state, and user-initiated WhatsApp continuation | `catalogOrder.spec.ts`, browser review |
| 53–56 | Reduced motion, touch targets, safe areas, and no horizontal overflow | `catalogOrder.spec.ts`, browser review |

### Review result

- The catalog remains a product inquiry. It has no price, payment, total, quantity, inventory, or checkout behavior.
- Catalog changes remain limited to local imagery, selection feedback, inquiry controls, and the five-product limit.
- The basket retains the approved light consultation-slip treatment, responsive composition, one-step removal, form states, and WhatsApp continuation.
- The WhatsApp API route, template contract, and webhook were not changed.
- The original product-11 illustration was replaced in catalog data with an existing reviewed local illustration after user QA found the former asset unreliable. No remote image source was introduced.
- No unrelated changes were made.

### Validation evidence

- 42 unit tests passed.
- TypeScript, formatting, lint, and production build passed.
- 31 catalog and basket end-to-end tests passed.
- Browser review passed at 320, 390, 768, and 1280 pixels. It verified the corrected product image, the empty-state action, target sizes, and no horizontal overflow.
- The user confirmed the overall experience and requested the two corrections completed in this issue.

### Suggested next step

- Add a project UI Craft brief before a future design finalization. This enables the formal finalization gate; it is not required for the completed catalog and basket scope.
