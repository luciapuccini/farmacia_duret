# Orders

A customer fills in the order form on `/orders` with their name, an Argentine phone number, an optional email, and notes for the pharmacist. On submit, the server sends the `pedido_imagen` WhatsApp template to the customer's phone and the page shows a confirmation.

## Sub-features

- `orders-open`: the form renders with name, phone (fixed `+54` dial code), email, notes, and a privacy checkbox that starts checked.
- `orders-send`: a valid submission sends one Graph template that carries the typed values and shows `Encargo enviado por WhatsApp`.
- `orders-phone-ar`: a non-Argentine phone shows `No soportamos telefonos fuera de Argentina` and sends nothing.
- `orders-consent`: unchecking privacy consent disables `Enviar por WhatsApp`.
- `orders-required`: submitting empty is blocked by browser validation and sends nothing.
- `orders-send-error`: a Graph failure shows an error and keeps the form values.
- `orders-daily-limit`: after 6 sends in one day, the page shows `Límite diario alcanzado`.

## How to get to it (user POV)

- Choose `Hacer un encargo` in the header (role `link`, inside the `banner`).
- Choose `Encargos` in the footer navigation.
- Open `/orders` directly.

## Driving it with browser.mjs

Preconditions:

- Doctor is all `ok`.
- The fresh profile has fewer than 6 sends today. Check with `$B storage`, key `orders_submissions`.

- **Open.** Run `$B goto /` and `$B click --role link --name "Hacer un encargo" --nth 0`. The URL is `/orders`, and `$B expect --role button --name "Enviar por WhatsApp"` passes.
- **Fill.** Run:
  - `$B fill --role textbox --name "Nombre completo*" --value "Verify Cliente"`
  - `$B fill --role textbox --name "Teléfono*" --value "11 1234-5678"`
  - `$B fill --label "Email" --value "verify@example.com"`
  - `$B fill --role textbox --name "Comentarios para el farmacéutico" --value "Ibuprofeno 400mg x2"`
  - `$B screenshot orders-filled`
- **Send.** Run `$B click --role button --name "Enviar por WhatsApp"` and `$B expect --text "Encargo enviado por WhatsApp"`, then `$B screenshot orders-sent`.
- **Side effect.** Check the new last line of `graph-requests.ndjson`:
  - `body.to` is `541112345678`.
  - `template.name` is `pedido_imagen`.
  - The parameters are `name`, `phone`, `email` and `notes`, with the typed values.
  - `network.ndjson` shows `/api/whatsapp/orders` responding with 200 and `messageId: wamid.verify.N`.
  - `$B storage` shows `orders_submissions` count incremented.
- **Non-AR phone.** Choose `Hacer otro encargo`, then fill the name, `+34 675 512 388` as the phone, and some notes. Submit. `$B expect --text "No soportamos telefonos fuera de Argentina"` passes, and `graph-requests.ndjson` gains no line.
- **Consent.** Run `$B uncheck --role checkbox` with `--nth 0` if needed. `Enviar por WhatsApp` is disabled. Check this with `$B aria orders-consent`, which shows the button as `[disabled]`.
- **Send error.** Run `curl -X POST http://127.0.0.1:4311/__control/fail-next/graph`, then submit a valid form. An error message appears, the values stay in the fields, and `network.ndjson` shows a non-200 response from `/api/whatsapp/orders`.

## Gotchas

- After a successful send, the confirmation heading scrolls under the sticky header in a 1280x900 viewport. Use `expect --text` rather than judging only from the screenshot.
- The rate limit lives in `localStorage` (`orders_submissions`). Six sends in one run hit the limit. To start fresh, tear down and bring the run up again. Do not edit storage by hand.
- The `Hacer un encargo` link exists in the header and in page bodies, so use `--nth 0` or scope by trying `aria` first.
- The template recipient is the customer's phone, not the pharmacy. With real credentials, this flow messages whatever number you type.
