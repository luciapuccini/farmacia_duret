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
Today, /orders opens a WhatsApp click-to-chat draft and does not persist order state. Real pharmacies need: order → confirmed → preparing → ready → picked up / canceled, with audit trail. Implement with XState (or a typed reducer), an idempotency key in the request (prevent double-submit), and Cloudflare Queues / Workflows for durable side effects (WhatsApp, email, SMS). Add a retry policy with exponential backoff.
Senior signal: Distributed systems hygiene, durability under failure, idempotency, queue semantics 

### WhatsApp Cloud API production path
Keep the live form on click-to-chat until Meta production setup is complete. Next steps: add public privacy and data-deletion pages; complete Meta app basic settings; connect the real Farmacia WhatsApp Business phone number; generate production credentials (`WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`); publish/review the app as required by Meta; subscribe webhooks to `messages`; create approved templates for business-initiated messages; then decide how API sends fit into the durable order pipeline.

## Observability

Observability + performance budget enforced in CI
Add OpenTelemetry → Cloudflare Workers Logpush → Datadog (or Honeycomb free tier). Wire Sentry for FE errors and Web Vitals. Add Lighthouse CI in your GitHub Actions: PR fails if LCP > 2.5s or CLS > 0.1 on key routes. Document a perf budget in docs/perf-budget.md
