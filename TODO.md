- measure interactions
- SEO review
- search categories
- validate if https://whapi.cloud/ could automate with whatsapp
- progress with CMS
- tests unit, e2e, visuals
- analytics -maybe posthog - domain + Google SC
- unify structure folders with clear client/server/ infra folders..
- Add admin dashboard to centralize the daily work, recetas mamagement first. Open to extent to other features (CMS updates? stock management, ...?)
- email service
- **[Future] Migrate catalog data from static JSON to Contentful**

## Features
### Admin dashboard with auth + DB-backed catalog
Replace the static categories.json with Cloudflare D1 (SQLite at the edge) or Turso. 
Add an /admin area gated by Auth.js with role-based access (admin, staff).
     Admins manage products, categories, stock;
      staff manage incoming orders. 
      Use Next.js Server Actions for mutations, RSC for reads.

AuthN/AuthZ design, RBAC, edge-DB tradeoffs, server actions vs API routes, protected route patterns.

### Order pipeline
Today, POST /api/reservas fires a Telegram message and forgets. Real pharmacies need: order → confirmed → preparing → ready → picked up / canceled, with audit trail. Implement with XState (or a typed reducer), an idempotency key in the request (prevent double-submit), and Cloudflare Queues / Workflows for durable side effects (Telegram, email, SMS). Add a retry policy with exponential backoff.
Senior signal: Distributed systems hygiene, durability under failure, idempotency, queue semantics 

## Observability

Observability + performance budget enforced in CI
Add OpenTelemetry → Cloudflare Workers Logpush → Datadog (or Honeycomb free tier). Wire Sentry for FE errors and Web Vitals. Add Lighthouse CI in your GitHub Actions: PR fails if LCP > 2.5s or CLS > 0.1 on key routes. Document a perf budget in docs/perf-budget.md