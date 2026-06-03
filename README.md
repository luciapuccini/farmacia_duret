# Farmacia Duret

Website for Farmacia Duret (Villa Rosa, Buenos Aires) — product catalog, contact page, and an online order system with WhatsApp order submission.
[website](https://farmaciaduret.online/)

## Stack


| Layer         | Technology                                       |
| --------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                          |
| Language      | TypeScript                                       |
| Styles        | SCSS Modules                                     |
| Runtime       | Cloudflare Workers (via`@opennextjs/cloudflare`) |
| Notifications | WhatsApp Cloud API templates                  |

The app runs fully server-side on Cloudflare's edge network. Dynamic routes and API endpoints are handled by a Cloudflare Worker; static assets are served from Cloudflare's CDN.

---

## Local development

```bash
npm install
npm run dev
```

To preview the app in the actual Workers runtime locally (instead of Node.js):

```bash
npm run preview
```

### Environment variables

Create an `.env.local` file in the project root, using `.env.example` as the template. Local development should use development/test values for the same variable names used in every environment. For example, use a test WhatsApp number as `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER`; do not introduce separate test-only aliases.

`.env.prod` documents the production variable shape, but production values should be configured in Cloudflare rather than committed to the repo.

Generate the webhook verification token with:

```bash
npm run whatsapp:token:generate
```

Use the generated value in both `.env.local` and Cloudflare's `WHATSAPP_WEBHOOK_VERIFY_TOKEN` secret. This value is chosen by us, not by Meta, and Meta sends it back during webhook verification.

---

## Deploy to production

### Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com)
- Wrangler authenticated: `npx wrangler login`
- The Worker name in `wrangler.jsonc` matches the name of your Worker in the Cloudflare dashboard (`farmacia-duret`)

### Deploy

```bash
npm run deploy
```

1. Builds the Next.js app via the OpenNext Cloudflare adapter (outputs to `.open-next/`)
2. Deploys the Worker and uploads static assets to Cloudflare

The live site URL is `https://farmaciaduret.online`.

---

## WhatsApp orders

When a customer submits an order from `/orders`, the form posts to `/api/whatsapp/orders`. That route sends the configured WhatsApp template with the submitted customer details and notes.

Required order-send variables:

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ORDER_RECIPIENT_PHONE_NUMBER`
- `WHATSAPP_ORDER_TEMPLATE_NAME`
- `WHATSAPP_ORDER_TEMPLATE_LANGUAGE` (defaults to `es_AR`)
- `WHATSAPP_GRAPH_API_VERSION` (defaults to `v25.0`)

The approved order template should have four body variables in this order: customer name, customer phone, customer email, and notes.

### Meta webhook setup

In the Meta WhatsApp Business Platform setup, use:

- Callback URL: `https://farmaciaduret.online/api/whatsapp/webhook`
- Verify token: the value of `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

After verification, subscribe the WhatsApp Business Account webhook to the `messages` field so incoming messages and status updates reach the app.

To rotate the verify token, generate a new value, update Cloudflare, update Meta's webhook configuration, update local `.env.local`, then verify the callback again in Meta.

---

## Project structure

```
src/
  app/                    # App Router routes, route groups, and API handlers
    (home)/               # Home page and page-local components
    (catalog)/            # Catalog category and subcategory routes
    contact/              # Contact page
    offers/               # Offers page
    orders/               # Order form page
    api/whatsapp/         # WhatsApp order route and webhook handlers
  ui/                     # Reusable UI primitives
    layout/               # Shared layout components like navbar and footer
  services/               # Integrations and server/client service modules
  utils/                  # Shared utilities such as slug helpers and JSON-LD safety
  config/                 # Centralized app configuration
  tests/                  # Test setup and automated tests
```

---

## Testing

| Level | What it tests | Command |
| --- | --- | --- |
| Unit | Pure logic (helpers, utils) | `npm test` |
| Integration | Module boundaries — API modules | `npm test` |
| E2E | Full browser flow against a running dev server | `npm run test:e2e` |
