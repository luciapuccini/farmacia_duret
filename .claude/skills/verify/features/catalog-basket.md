# Catalog basket inquiry

A customer browses catalog categories, adds up to 5 products to an inquiry, reviews the selection on `/basket`, enters a phone number, and sends it. The server sends the `pedido_catalogo` WhatsApp template that lists the selected products.

## Sub-features

- `catalog-browse`: category pages at `/<category-slug>`, with the subcategory and filter in the `?sc=` and `?f=` query parameters.
- `catalog-add`: `Agregar <product>` adds the product. The button turns into `Agregado ✓: <product>` and the header counter shows `N de 5`.
- `catalog-limit`: with 5 items, the other products show `Máximo alcanzado: <product>`.
- `basket-review`: `/basket` shows the `Revisá tu consulta` heading, a `Productos seleccionados` region and the `N de 5 productos` count.
- `basket-remove`: `Borrar <product> de la consulta` removes an item.
- `basket-empty`: with no items, the `Todavía no agregaste productos.` region shows a `Seguir explorando` link.
- `basket-send`: a valid phone plus `Enviar consulta por WhatsApp` sends one Graph template and shows `Consulta enviada.`.
- `basket-phone-errors`: an invalid phone shows `Ingresá un teléfono válido.`. A non-Argentine phone shows `No soportamos telefonos fuera de Argentina`.

## How to get to it (user POV)

- Choose a category in the second header nav, for example `Dermocosmética`, `Belleza` or `Bebes`. Categories also appear in the footer `Catálogo` list.
- Open the basket with the header link named `Revisar consulta: N de 5 productos seleccionados`.
- On mobile (`$B viewport 412 915`), use the floating `Revisar consulta. N de 5 productos` link on category pages.

## Driving it with browser.mjs

Preconditions:

- Doctor is all `ok`.
- The basket is empty, which is true in a fresh run.

- **Browse.** Run `$B goto /` and `$B click --role link --name "Dermocosmética" --nth 0`. The URL is `/dermocosmetica`. Run `$B expect --role button --name "Agregar" --nth 0` so the products finish loading, then run `$B aria catalog-dermo` to read the product names, for example `Agua Micelar Sensibio H2O 500ml`.
- **Add.** Pick a product name from the snapshot and run `$B click --role button --name "Agregar <product>"`. `$B expect --role button --name "Agregado ✓: <product>"` passes, and the header link reads `Revisar consulta: 1 de 5 productos seleccionados`.
- **Review.** Run `$B click --role link --name "Revisar consulta: 1 de 5 productos seleccionados"`. The URL is `/basket`, and `$B expect --text "1 de 5 productos" --exact` passes. Run `$B screenshot basket-review`.
- **Send.** Run:
  - `$B fill --label "Teléfono" --value "11 6755-1238"`
  - `$B click --role button --name "Enviar consulta por WhatsApp" --nth 0`
  - `$B expect --text "Consulta enviada."`
  - `$B screenshot basket-sent`
- **Side effect.** The last line of `graph-requests.ndjson` has `template.name` set to `pedido_catalogo`, `to` set to `541167551238`, and the selected product among its parameters. `network.ndjson` shows a 200 response from `/api/whatsapp/catalogo`.
- **Remove and empty.** Add a product again, open `/basket`, and run `$B click --role button --name "Borrar <product> de la consulta"`. `$B expect --text "Todavía no agregaste productos."` passes.

## Gotchas

- Known bug, observed on 2026-10-03: the phone field shows a fixed `+54` and the placeholder `11 1234-5678`, but the route sends `to: "1167551238"` without the `54` prefix. `/orders` sends `541112345678` for the same input. Until this is fixed, the `to` check in **Side effect** fails. Report the failure. Do not adjust the expectation to match.
- With nothing selected, the header has no `Revisar consulta` link. It appears after the first add.

- Product buttons briefly render as `aria-hidden` while loading. Wait with `expect` on the `Agregar` button before you click it.
- The basket lives in `localStorage` (`basket_items`) and persists for the whole run. Remove items through the UI, or restart the run.
- The send button also appears in the mobile `Acción de consulta` region. On a mobile viewport, `--nth 0` may pick a different copy than on desktop.
- The e2e suite drives this flow with HAR replays. This skill drives it against the real route handler instead, so expect real validation messages.
