# Farmacia Duret

Website for Farmacia Duret (Villa Rosa, Buenos Aires) — product catalog, contact page, and an online order system with Telegram notifications.

## Stack


| Layer         | Technology                                       |
| --------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                          |
| Language      | TypeScript                                       |
| Styles        | SCSS Modules                                     |
| Runtime       | Cloudflare Workers (via`@opennextjs/cloudflare`) |
| Notifications | Telegram Bot API                                 |

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

Create a `.dev.vars` file in the project root (this is the Wrangler equivalent of `.env.local`):

```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
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

## Telegram notifications

When a customer submits an order from `/reservas`, the API route `/api/reservas` sends a Telegram message (and photo if attached) to a configured group.

---

## Project structure

```
src/
  app/                  # Next.js App Router pages and API routes
    api/reservas/       # Order submission endpoint → Telegram
    reservas/           # Order form page
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
| Integration | Module boundaries — Contentful, Telegram API route | `npm test` |
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