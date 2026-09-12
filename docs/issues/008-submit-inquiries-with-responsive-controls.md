## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Deliver the complete pre-success submission path for a non-empty basket. Customers must be able to enter an Argentine phone number, submit through standard form behavior, understand validation or API failures, and retain their work after a failure. The same form state should power a thumb-reachable mobile action and the desktop basket panel without duplicating the primary action within a viewport.

Use the existing catalog inquiry API and WhatsApp template contract unchanged. This slice ends at successful API acknowledgment; the dedicated success and WhatsApp-continuation state is delivered by the next issue.

## Acceptance criteria

- [ ] A non-empty basket presents one phone input associated with a visible label.
- [ ] The phone field retains the existing Argentine validation rules and appropriate telephone input semantics.
- [ ] Submitting an empty or invalid phone value shows an inline error associated with the field.
- [ ] Pressing Enter while focused in the form triggers the same submission behavior as the visible action.
- [ ] On small screens, “Enviar consulta por WhatsApp” is the only visible submit action and remains in a safe-area-aware sticky bottom region.
- [ ] Mobile document spacing prevents the sticky action from covering products, guidance, phone errors, or the phone field.
- [ ] On larger screens, the submit action appears inside the sticky light basket panel and no mobile duplicate is visible.
- [ ] Every submit action has visible keyboard focus and a minimum 44-by-44-pixel target.
- [ ] A valid submission sends the customer phone number and one to five selected product names through the existing API contract.
- [ ] While the request is pending, the action communicates sending progress and cannot submit a duplicate request.
- [ ] A failed API response returns the interface to a usable submission state.
- [ ] Failure displays one static inline error message near the submission action.
- [ ] Failure preserves the selected products and the entered phone number.
- [ ] No error-specific retry control, alternate recovery workflow, or prefilled direct-WhatsApp fallback is added.
- [ ] Submission state changes use the agreed CSS-only timing and never animate layout dimensions.
- [ ] Reduced-motion preferences preserve all feedback without spatial movement.
- [ ] End-to-end tests use mocked or recorded responses and never send real WhatsApp messages.
- [ ] End-to-end tests cover missing phone, invalid phone, non-Argentine phone, Enter submission, request payload, sending state, duplicate prevention, static failure, and preserved input and products.
- [ ] Responsive tests cover 320-pixel phone, tablet, and desktop layouts without horizontal overflow or obscured controls.
- [ ] The server API, WhatsApp template, webhook, and conversation-tracking behavior remain unchanged.

## Blocked by

- Blocked by `issues/006-build-responsive-basket-review.md`

## User stories addressed

- User stories 38–46
- User stories 53–56

## STATUS

TODO — mark as DONE once implemented successfully and validated with the user.
