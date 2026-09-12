## Parent PRD

`docs/catalog-basket-inquiry-prd.md`

## Type

AFK

## What to build

Deliver the final successful outcome after the catalog inquiry API acknowledges the request. Correct the current state-ordering defect so clearing persisted basket data does not replace the success experience with the empty state. The customer should remain on the basket page, understand what happened, and choose whether to continue in the pharmacy’s WhatsApp conversation.

The WhatsApp continuation must use the verified public business number already used by the integration. It is a user-initiated click-to-chat link, not an automatic redirect and not a deep link derived from the API message identifier.

## Acceptance criteria

- [ ] A successful API response clears persisted basket products.
- [ ] Clearing persisted products does not cause the empty state to replace the success state.
- [ ] The basket renders a dedicated success panel headed “Consulta enviada.”
- [ ] The success copy explains that Farmacia Duret sent a message so the conversation can continue through WhatsApp.
- [ ] The success panel exposes one primary action labeled “Continuar en WhatsApp.”
- [ ] The continuation action targets the verified public business number `5491178942852` through WhatsApp click-to-chat.
- [ ] The API message identifier is not used as a browser conversation link.
- [ ] WhatsApp opens only after the customer activates the continuation action.
- [ ] The site does not automatically redirect after submission.
- [ ] The former product list, phone form, and mobile sticky submit action are not presented as still active in the success state.
- [ ] Returning to a catalog route after success shows an empty inquiry with selectable product actions.
- [ ] The success-state transition uses the agreed restrained CSS-only timing.
- [ ] Reduced-motion preferences deliver the final success state without spatial movement.
- [ ] End-to-end tests verify the request payload, successful response, cleared storage, persistent success message, absence of the empty message, correct WhatsApp link, no automatic navigation, and reset catalog state.
- [ ] Existing API and template unit tests continue to pass without contract changes.

## Blocked by

- Blocked by `issues/008-submit-inquiries-with-responsive-controls.md`

## User stories addressed

- User stories 47–52

## STATUS

TODO — mark as DONE once implemented successfully and validated with the user.
