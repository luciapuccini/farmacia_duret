# PRD: Catalog and Basket Inquiry Experience

## Problem Statement

Customers can currently select sample products from the catalog and send the selection to Farmacia Duret through WhatsApp, but the experience behaves visually and linguistically like an unfinished online checkout.

The catalog uses remote sample-image URLs whose contents can change or disappear. This makes the catalog visually unstable and creates a third-party runtime dependency for imagery that is meant to be illustrative.

Adding a product also has almost no visible feedback. The product-card action does not communicate that the selection succeeded, and the basket control is hidden while empty and positioned near the top of the catalog. A customer browsing farther down the page, especially on a phone, may not notice the updated basket or may have to scroll back to find it.

The basket itself is visually plain and does not explain that it is an inquiry rather than a purchase. It lacks the warmth, hierarchy, and reassurance already present in the separate order experience. Its empty, error, and success states are underdeveloped, and the intended success message is currently bypassed when the basket is cleared.

The resulting journey leaves customers uncertain about whether a product was selected, where to continue, and what Farmacia Duret will do after the inquiry is submitted.

## Solution

Create a clear, responsive product-inquiry journey across the existing catalog and basket.

The catalog will keep its existing card composition and grid density. Its remote sample imagery will be replaced with a cohesive set of locally stored, AI-generated illustrations. Each current sample product will receive its own brand-neutral illustration, and a neutral fallback will cover products without assigned artwork. The illustrations will suggest the appropriate product type without reproducing logos, branded packaging, trademarked trade dress, or medical claims.

Selecting a product will provide immediate and persistent feedback. The originating action will become a disabled “Agregado ✓” state. On phones, a safe-area-aware bottom action will appear and provide a direct path to review the inquiry. On desktop, a compact inquiry control will appear inside the sticky navigation. These controls will exist only on catalog pages.

The basket will retain “Carrito” as a familiar navigation landmark while presenting the task itself as an inquiry. Its primary heading will be “Revisá tu consulta,” and actions and status messages will consistently refer to adding, reviewing, and sending a consultation rather than purchasing products.

Visually, the basket will become a lighter sibling of the existing order experience. It will reuse the established blue-and-mint design language, numbered next steps, subtle diagonal texture, and trustworthy tone without duplicating the order page’s dark panel. A consultation-slip motif will provide one restrained signature detail.

On mobile, the basket will use a single-column layout and a sticky bottom submission action. On larger screens, the selected-product list will sit beside a sticky submission and guidance panel. The customer can remove products immediately, provide a phone number, submit the inquiry, and continue the resulting conversation in WhatsApp.

## User Stories

1. As a catalog customer, I want the interface to describe my selection as an inquiry, so that I do not mistake it for a completed online purchase.
2. As a catalog customer, I want “Carrito” to remain as a familiar navigation landmark, so that I can still recognize where my selected products are stored.
3. As a catalog customer, I want product actions to use inquiry-oriented wording, so that the interface accurately sets expectations about availability and pricing.
4. As a catalog customer, I want every sample product image to load from the Farmacia Duret site, so that images do not unexpectedly change or disappear.
5. As a catalog customer, I want the sample illustrations to match the pharmacy’s friendly visual identity, so that the catalog feels cohesive with the rest of the site.
6. As a catalog customer, I want each current sample product to have distinguishable artwork, so that nearby products do not all look identical.
7. As a catalog customer, I want product artwork to remain clearly illustrative, so that I do not confuse it with an exact representation of branded packaging.
8. As a catalog customer, I want a graceful fallback image when product artwork is unavailable, so that the card never appears broken.
9. As a catalog customer, I want the product image area to remain stable while images load, so that the page does not jump while I browse.
10. As a catalog customer, I want immediate confirmation after selecting a product, so that I know my tap or click succeeded.
11. As a catalog customer, I want a selected product’s action to remain visibly marked as “Agregado ✓”, so that I can recognize selections while continuing to browse.
12. As a catalog customer, I want the action for an already selected product to be disabled, so that a repeated tap does not create a duplicate or remove it unexpectedly.
13. As a returning catalog customer, I want previously selected products to render in their selected state after navigation or reload, so that the UI matches the persisted inquiry.
14. As a mobile catalog customer, I want a persistent bottom action after my first selection, so that I can reach the basket without scrolling back to the top.
15. As a mobile catalog customer, I want the persistent action to remain above my device’s gesture area, so that it is comfortable and reliable to tap.
16. As a mobile catalog customer, I want catalog content to reserve space for the persistent action, so that the action does not cover the last products on the page.
17. As a desktop catalog customer, I want a compact inquiry control in the sticky navigation, so that the basket remains available as I scroll.
18. As a catalog customer, I want the persistent control to show the number of selected products out of five, so that I understand my progress toward the limit.
19. As a customer with five selected products, I want the interface to tell me that my inquiry is complete, so that the limit feels intentional rather than broken.
20. As a customer with five selected products, I want unselected product actions to explain that the maximum has been reached, so that disabled controls are understandable.
21. As a screen-reader customer, I want selection and limit changes announced politely, so that I receive the same feedback as a sighted customer.
22. As a customer browsing outside the catalog, I do not want catalog inquiry controls to follow me into unrelated pages, so that the home, contact, and separate order experiences remain distinct.
23. As a customer reviewing the basket, I want the heading “Revisá tu consulta,” so that the purpose of the page is immediately clear.
24. As a mobile basket customer, I want selected products, contact details, and the final action arranged in one clear column, so that the experience is easy to follow on a small screen.
25. As a desktop basket customer, I want products and submission guidance separated into two complementary areas, so that I can review and submit without excessive scrolling.
26. As a basket customer, I want to see the local product illustration beside each selected product, so that I can scan and verify my choices quickly.
27. As a basket customer, I want the product name to remain the primary identifying information, so that illustrative artwork never substitutes for accurate text.
28. As a basket customer, I want to see how many distinct products I selected out of five, so that the basket’s constraint remains visible.
29. As a basket customer, I want a short explanation of what happens after submission, so that I know the pharmacy will confirm stock, price, and collection details.
30. As a basket customer, I want the visual treatment to feel related to the existing order flow, so that both services feel like part of the same pharmacy.
31. As a basket customer, I want the basket to use a lighter variation of the order page’s information panel, so that the two workflows remain related but distinguishable.
32. As a basket customer, I want decorative details to reinforce the consultation concept, so that the page feels considered without becoming visually noisy.
33. As a basket customer, I want to remove an unwanted product with one clear action, so that correcting my inquiry is quick.
34. As a basket customer, I want removal to happen immediately without confirmation or undo, so that this low-risk interaction stays simple.
35. As a basket customer, I want removing a product to update every item count and limit state, so that the interface remains internally consistent.
36. As a basket customer who removes the final product, I want to see a designed empty state, so that the page does not feel broken or unfinished.
37. As a customer with an empty basket, I want one “Seguir explorando” action to the existing default catalog destination, so that I can resume browsing without additional routing logic.
38. As a basket customer, I want to provide my Argentine phone number, so that the pharmacy can contact me about the inquiry.
39. As a mobile basket customer, I want “Enviar consulta por WhatsApp” to remain within thumb reach, so that I do not need to find a separate button after reviewing products.
40. As a mobile basket customer, I want only one final submission action, so that the sticky control does not duplicate another button in the page content.
41. As a desktop basket customer, I want the submission action to live in the sticky right-hand panel, so that it remains available while I review the list.
42. As a keyboard customer, I want to submit the phone form with Enter, so that the flow follows standard form behavior.
43. As a customer who submits an invalid phone number, I want an inline field error associated with the phone input, so that I know how to correct it.
44. As a customer while the inquiry is being sent, I want the action to communicate progress and prevent duplicate submission, so that I do not send the same request twice.
45. As a customer whose submission fails, I want my products and phone number preserved, so that I do not have to rebuild the inquiry.
46. As a customer whose submission fails, I want one static inline error message, so that the failure is clear without adding another decision or fallback path.
47. As a customer whose submission succeeds, I want to see “Consulta enviada,” so that I know the request reached the pharmacy.
48. As a customer whose submission succeeds, I want the basket storage cleared, so that a completed inquiry does not remain active when I return to the catalog.
49. As a customer whose submission succeeds, I want the success state to remain visible instead of being replaced by the empty state, so that completion is acknowledged correctly.
50. As a customer whose submission succeeds, I want a “Continuar en WhatsApp” action, so that I can move directly into the conversation with the pharmacy.
51. As a customer using WhatsApp on mobile or desktop, I want the continuation action to use the pharmacy’s verified public WhatsApp number, so that it opens the same business contact that sent the inquiry message.
52. As a customer whose submission succeeds, I do not want an automatic redirect, so that I retain control over whether and when WhatsApp opens.
53. As a motion-sensitive customer, I want all spatial motion removed when my system requests reduced motion, so that the interface remains comfortable to use.
54. As a customer, I want animations to remain quick and purposeful, so that feedback feels responsive rather than decorative.
55. As a touch customer, I want every new interactive target to be at least 44 by 44 pixels, so that actions are reliable to tap.
56. As a customer using a 320-pixel-wide device, I want the catalog and basket controls to avoid horizontal scrolling, so that the complete flow remains usable.

## Implementation Decisions

- The experience is a product inquiry, not an online purchase. No price, payment, order-total, inventory guarantee, or checkout language will be introduced.
- “Carrito” remains the familiar navigation landmark. The task heading and all consequential actions use consultation language.
- The existing product-card composition, responsive grid, catalog filters, and catalog information hierarchy will not be redesigned.
- The only catalog-card changes are the local image source, persisted added state, limit state, accessible feedback, and the labels needed to communicate those states.
- Twenty original AI-generated raster illustrations will be created for the current sample products, plus one neutral fallback illustration.
- Generated illustrations will share one art direction, aspect ratio, composition system, lighting treatment, and blue-and-mint-compatible palette.
- Illustrations will be brand-neutral and will not reproduce logos, trademarks, exact packaging, trade dress, prescription information, dosage instructions, efficacy claims, or other content that could imply product-image accuracy.
- Final illustrations will be optimized and stored in the public static asset tree. Catalog data will reference only local product images; remote product-image URLs will be removed.
- Asset provenance and the intentionally illustrative nature of the imagery will be recorded alongside the asset set. The existing public disclaimer that product photos are illustrative remains applicable.
- The basket domain will be treated as a deep module with a small observable interface for reading a snapshot, subscribing to changes, adding an item, removing an item, and clearing the basket.
- The basket module will remain backed by browser storage and will continue to tolerate unavailable, malformed, or invalid stored data by returning an empty basket.
- Basket item identity remains product-ID based. Duplicate products are not allowed.
- The maximum remains five distinct products. Quantity selection is not introduced.
- The add operation will expose enough outcome information for the interface to distinguish a successful addition from an already selected product and a full basket.
- Catalog product actions, the mobile inquiry action, the desktop navigation control, and the basket page will observe the same basket snapshot rather than maintain independent counts.
- A product already present in storage will render as “Agregado ✓” immediately after client hydration and remain disabled.
- After a successful addition, the product action changes to “Agregado ✓” and does not act as a removal toggle.
- Product removal is available only inside the basket.
- The first added product reveals a catalog-only persistent inquiry control. Subsequent changes update its count without replaying the full entrance.
- On mobile catalog viewports, the inquiry control is a bottom action with safe-area padding and reserved content space.
- On desktop catalog viewports, the inquiry control is integrated into the existing sticky navigation.
- The catalog inquiry control is hidden on non-catalog routes and on the basket page.
- From one through four products, the persistent action communicates the count and offers “Revisar consulta.”
- At five products, the persistent action communicates “Consulta completa,” while unselected product actions show “Máximo alcanzado” and remain unavailable.
- Removing a product in the basket immediately restores availability for unselected products when the customer returns to the catalog.
- Basket selection and maximum-limit changes will be announced through a polite live region. The visual state will not be the only feedback channel.
- The basket uses a single-column information order on small screens and a two-column layout on larger screens.
- On larger screens, the selected-product list is the primary area and the consultation guidance, phone input, item count, and submission action live in a sticky secondary panel.
- On small screens, the selected-product list appears before the contact field and final action.
- The mobile final action is the only visible submit control and remains in a safe-area-aware sticky bottom region. The document reserves enough bottom space to prevent content occlusion.
- The basket’s visual direction is a light sibling of the existing order experience. It reuses the established palette, typography, numbered square steps, diagonal texture, and reassuring tone without copying the existing dark gradient composition.
- A restrained consultation-slip detail, such as a clipped corner or perforation cue, serves as the basket’s signature visual element.
- Selected products appear in one clean list surface rather than a collection of independent floating cards.
- Each selected-product row includes the local illustration, product name, supporting product information already available in the catalog data, and one clearly named removal control.
- Removal updates application state immediately and is final. There is no confirmation dialog, temporary notice, or undo action.
- The empty state uses a purpose-built light panel with “Todavía no agregaste productos” and one “Seguir explorando” action.
- The empty-state action links to the same default catalog destination currently used by the site’s main catalog navigation. No last-location persistence is introduced.
- Submission remains an inquiry containing the customer phone number and up to five product names. The existing server API shape and WhatsApp template contract remain unchanged.
- The phone interaction will use semantic form submission, retain inline validation, associate errors with the field, and support Enter-key submission.
- During submission, the action communicates that the request is being sent and prevents a duplicate request.
- An API failure preserves the selected products and entered phone number and displays one static inline error message. No retry-specific UI, prefilled deep-link fallback, or additional recovery workflow is added.
- On API success, persistent basket storage is cleared, but the basket view enters an explicit success state before empty-state logic is considered.
- The success state uses the heading “Consulta enviada” and explains that Farmacia Duret sent a message so the conversation can continue in WhatsApp.
- The success state includes one primary “Continuar en WhatsApp” link to the verified public business number used by the WhatsApp integration.
- The WhatsApp continuation is user initiated. The site does not automatically redirect after submission.
- Motion will use CSS transitions and keyframes only. No animation dependency will be added.
- Shared motion tokens will cover a fast 120-millisecond feedback transition, a 200-millisecond state transition, and a 280-millisecond persistent-control entrance. Exit timing will remain shorter than or equal to entrance timing.
- Add-state text and icon changes use a 120-millisecond crossfade without bounce or overshoot.
- The persistent inquiry control uses a 280-millisecond opacity-and-transform entrance only when it first appears. Count changes use a 120-millisecond transition.
- Basket row removal commits immediately and may use a restrained 150-millisecond opacity-and-transform exit without delaying state consistency.
- Submission success and error presentation may use a 200-millisecond state transition.
- Animations use compositor-friendly opacity and transform properties. Layout dimensions, positions, and inherited variables will not be continuously animated.
- There will be no card entrance animation, scroll reveal, page transition, bounce, confetti, parallax, or attention-seeking decoration.
- Reduced-motion preferences remove spatial movement and deliver every final state immediately. Essential loading and focus feedback remain perceptible.
- All new interactive targets will provide visible focus treatment, accessible names, keyboard operation, and a minimum 44-by-44-pixel touch area.
- The implementation must avoid hydration mismatches or a misleading empty-state flash when browser-stored basket data is loaded.

## Testing Decisions

- Tests will assert behavior visible through public module interfaces, rendered UI, browser storage, navigation, accessibility roles, and network requests. Tests will not assert component internals, state-variable names, CSS class names, or animation implementation details.
- Basket-domain unit tests will cover an initially empty snapshot, successful addition, duplicate prevention, the five-product limit, removal, clearing, malformed stored data, schema-invalid stored data, subscriber notification, and distinct add outcomes.
- Catalog-data tests will verify that every current product points to a local asset, that the referenced assets exist, that the fallback is available, and that no remote product-image URL remains.
- Existing catalog filtering tests remain authoritative for which products appear for category, subcategory, and filter combinations.
- End-to-end catalog tests will verify that selecting a product persists it, changes the originating action to “Agregado ✓”, updates the count, and exposes the route-appropriate inquiry control.
- End-to-end tests will verify that a selected product remains selected after navigation and reload.
- End-to-end tests will verify that the fifth selection produces the completed state and that further unselected products explain the maximum limit.
- End-to-end tests will verify that the inquiry control is present on catalog routes only and absent from unrelated routes and the basket route.
- End-to-end tests will verify the mobile bottom action and desktop sticky-navigation control at representative viewport widths.
- End-to-end basket tests will verify selected-product rendering, local thumbnails, immediate removal, count updates, and the transition to the empty state after removing the final item.
- End-to-end tests will verify that “Seguir explorando” navigates to the current default catalog destination.
- Existing phone-validation behavior remains covered, including missing, invalid, and non-Argentine values.
- End-to-end submission tests will continue using recorded or mocked API responses so tests do not send real WhatsApp messages.
- The success test will verify that the request contains the selected product names and phone number, storage is cleared, “Consulta enviada” remains visible, the empty state does not replace it, and “Continuar en WhatsApp” targets the verified business number.
- The error test will verify that a failed response displays the static inline message while preserving the products, phone number, and ability to submit again through the existing action.
- Accessibility-oriented end-to-end assertions will verify accessible control names, polite announcements, associated phone errors, keyboard submission, focus visibility, and disabled-limit explanations.
- Reduced-motion end-to-end coverage will emulate the system preference and verify that selection, removal, and submission reach their correct visual states without depending on spatial animation.
- Responsive checks will cover at least 320-pixel phone, common phone, tablet, and desktop widths. They will verify no unintended horizontal scrolling, no content hidden behind sticky controls, safe-area accommodation, and minimum touch-target sizes.
- Visual quality assurance will manually compare the catalog and basket with the existing site at phone and desktop sizes. It will confirm that generated assets are cohesive, product text remains primary, the basket reads as a lighter sibling of the order page, and decorative details do not overpower the task.
- Existing unit tests for the WhatsApp API route remain prior art for request validation and template payload behavior. Existing basket unit tests remain prior art for browser-storage behavior, and the existing catalog-order Playwright suite remains prior art for the complete customer flow.

## Out of Scope

- Redesigning product cards, catalog filters, catalog grid density, catalog navigation, or responsive column counts.
- Adding prices, totals, taxes, discounts, payments, checkout, stock status, delivery, or purchase confirmation.
- Adding quantities or allowing duplicate product entries.
- Removing products directly from catalog cards.
- Showing catalog inquiry controls on the home page, contact page, separate order flow, or other non-catalog routes.
- Creating a new main catalog landing page.
- Remembering the customer’s last category, filter, catalog URL, or scroll position.
- Automatically navigating to the basket after a product is selected.
- Automatically redirecting to WhatsApp after successful submission.
- Adding a confirmation dialog, temporary removal notice, or undo behavior.
- Adding error-specific retry controls, alternate WhatsApp recovery actions, or a prefilled manual-message fallback.
- Changing the WhatsApp message template, server-side API contract, webhook behavior, or conversation-tracking model.
- Adding a motion library or any other runtime dependency.
- Introducing page transitions, scroll-driven animation, celebratory animation, or sound feedback.
- Using exact branded product photography, manufacturer packaging, logos, or third-party hotlinked imagery.
- Refactoring unrelated site-wide controls or correcting unrelated copy and style issues discovered during implementation.

## Further Notes

- Farmacia Duret’s tone remains humble, friendly, trustworthy, and people-first. All customer-facing copy is Spanish for Argentina and should use correct accents and locally natural phrasing.
- “Consulta” describes the customer’s task. “Carrito” is retained only where its familiarity improves navigation.
- Availability and price are confirmed later by the pharmacy through WhatsApp. The interface must never imply that submission reserves stock or completes a sale.
- The public WhatsApp click-to-chat destination uses the same business number that sends the catalog template. The API’s message identifier is not treated as a browser-deep-link identifier.
- Generated artwork must be reviewed as a complete set before integration. Reject images containing accidental text, logos, recognizable packaging, misleading dosage information, distorted products, or inconsistent visual treatment.
