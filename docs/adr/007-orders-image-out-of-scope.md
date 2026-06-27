# ADR 007 — Order image sharing is out of scope for the template API

**Date:** 2026-06-27
**Status:** Accepted
**Supersedes:** Image-related sections of ADR 004

## Context

The orders form collected an optional image (prescription or reference photo) from the customer.
The intent was to forward that image to the pharmacy as part of the WhatsApp order notification.

Three approaches were evaluated:

1. **Template with image header** — WhatsApp Cloud API templates support an image header component
   (`type: "header"`, `parameters: [{ type: "image", image: { link | id } }]`). However, any
   template with a media header requires a separate Meta review and approval cycle. Since our
   templates function as a proxy to initiate a business → customer conversation on behalf of a
   form submission, every image-enabled template variant would need its own approval. This
   introduces too much friction for an optional feature.

2. **Non-template media messages (Cloud API `/messages`)** — Free-form image messages can only be
   sent within the 24-hour customer-service window that opens after a customer contacts the
   business. Since the pharmacy initiates the conversation via template, no such window exists at
   form submission time. These are also paid messages billed per send.

3. **Quick Reply button to open a conversation** — Adding a quick reply button to the template
   opens a 24-hour window after the customer taps it. However, once the customer receives any
   template message they can already reply with an image directly in the WhatsApp thread — the
   button adds no capability beyond a UX nudge and still requires template approval.

## Decision

Remove the image field from the order form. Customers who need to share a prescription or
reference image will do so manually in the WhatsApp conversation after receiving the order
confirmation template. This is standard WhatsApp behavior and requires no additional API surface.

## Consequences

- The image input, validation, SCSS styles, and all related state are removed from the orders page.
- The test case that verified images were silently ignored is removed.
- The WhatsApp API route is unchanged.
- If a future business requirement makes automatic image delivery critical, the recommended path
  is a dedicated approved template with an image header, with the image uploaded via Meta's Media
  API (`POST /{phone-number-id}/media`) to avoid external hosting. This would require a new env
  var `WHATSAPP_ORDER_TEMPLATE_NAME_WITH_IMAGE` and a separately approved template in the
  WhatsApp Manager.
