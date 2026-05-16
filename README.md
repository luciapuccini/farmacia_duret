# Farmacia Duret

Website for Farmacia Duret (Villa Rosa, Buenos Aires) — product catalog, contact page, and an online order system with WhatsApp handoff.

## Stack


| Layer         | Technology                                       |
| --------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                          |
| Language      | TypeScript                                       |
| Styles        | SCSS Modules                                     |
| Runtime       | Cloudflare Workers (via`@opennextjs/cloudflare`) |
| Notifications | WhatsApp click-to-chat handoff                  |

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

Create an `.env.local` file in the project root:

```
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=5491178942852
WHATSAPP_WEBHOOK_VERIFY_TOKEN=generate_a_private_random_token
```

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

The live site URL is `https://farmacia-duret.puccinilucia.workers.dev`.

---

## WhatsApp handoff

When a customer submits an order from `/orders`, the form opens WhatsApp with a prefilled message to the configured Business account. The customer reviews the draft and presses Send in WhatsApp.

### Meta webhook setup

In the Meta WhatsApp Business Platform setup, use:

- Callback URL: `https://farmaciaduret.online/api/whatsapp/webhook`
- Verify token: the value of `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

After verification, subscribe the WhatsApp Business Account webhook to the `messages` field so incoming messages and status updates reach the app.

---

## Project structure

```
src/
  app/                  # Next.js App Router pages and API routes
    api/whatsapp/       # Meta webhook verification and event receiver
    orders/             # Order form page → WhatsApp click-to-chat
    [category]/         # Dynamic catalog pages
  components/           # Shared UI components
  layout/               # Navbar, Footer, Breadcrumb, Container
  data/                 # categories.json — catalog structure
  helpers/              # Shared utilities and hooks
```


## Using cloudflare & env settings

local dev config lives in `.env.local` 

`.dev.vars` is cloudflare config, not available in next.js runtime

---

## Testing

Three levels, two runners.

| Level | What it tests | Command |
| --- | --- | --- |
| Unit | Pure logic (helpers, utils) | `npm test` |
| Integration | Module boundaries — Contentful service | `npm test` |
| E2E | Full browser flow against a running dev server | `npm run test:e2e` |

### Unit & integration (Vitest)

```bash
npm test
```

No network calls — external dependencies are mocked via `vi.mock()` and JSON fixtures in `src/tests/fixtures/`.

### E2E (Playwright)

```bash
npm run test:e2e
```

Starts `next dev` automatically, then drives real Chromium. For the interactive debugger:

```bash
npm run test:e2e:ui
```
