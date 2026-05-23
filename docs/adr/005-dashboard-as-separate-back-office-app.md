# ADR 005 - Dashboard as separate back-office application

**Date:** 2026-05-23
**Status:** Proposed

## Context

The project now has a dashboard proof of concept at `/dashboard`. The POC renders an internal order-management interface using fixture data from `src/data/dashboard-orders.json`.

The dashboard has different requirements from the public catalog site:

- It is staff-only.
- It will handle sensitive order and medical/prescription information.
- It needs authentication and authorization.
- It will read and write operational data from the application database.
- It does not need SEO, public navigation, catalog browsing, promo banners, or public footer content.
- It will likely grow into multiple protected sub-routes.

The current public app is optimized for the customer-facing website: catalog discovery, content pages, contact, offers, and order submission. Keeping the dashboard inside the same deployed application would mix public traffic and private operational workflows.

## Decision

Build the production dashboard as a separate back-office application, deployed separately from the public website.

The public website remains hosted at:

```txt
farmaciaduret.online
www.farmaciaduret.online
```

The dashboard will be hosted at:

```txt
dashboard.farmaciaduret.online
```

The dashboard hostname will be protected by Cloudflare Access through Cloudflare Zero Trust. General public traffic must not reach the dashboard application.

The dashboard may reuse or copy design tokens, brand styles, and selected UI patterns from the public app, but it should not reuse the public website shell, navbar, footer, promo banner, SEO layout, or catalog navigation.

## Architecture

### Applications

There will be two deployed applications:

```txt
Public website
- Domain: farmaciaduret.online
- Audience: customers and public visitors
- Responsibilities: catalog, contact, order submission, WhatsApp handoff

Dashboard
- Domain: dashboard.farmaciaduret.online
- Audience: pharmacy staff
- Responsibilities: order management, state transitions, audit trail, prescription/order review
```

Each application should be deployable independently.

For MVP, both applications may live in the same repository. The preferred long-term structure is:

```txt
apps/
  public/
  dashboard/
packages/
  domain/
  ui-tokens/
```

The repository does not need to be migrated to this structure immediately if doing so slows down the MVP. The important boundary is the deployed application boundary.

### Authentication

Use Cloudflare Access to protect the entire dashboard hostname:

```txt
dashboard.farmaciaduret.online/*
```

Access policy:

- Deny by default.
- Allow only approved staff emails.
- Start with two staff users.
- Configure a reasonable session duration.
- Prefer email OTP or an existing identity provider.
- Enable MFA if available through the chosen identity provider.

The dashboard application should also validate Cloudflare Access identity server-side before serving sensitive data or running mutations. Cloudflare Access is the first gate; application-side identity validation is defense in depth.

### Database

Use a shared operational database for order-management data.

The current preferred database is Supabase Postgres because:

- It provides standard Postgres.
- It has a free tier suitable for POC/MVP.
- It reduces backend setup time.
- It supports a later upgrade path to paid backups and higher reliability.
- It fits the relational model from ADR 003.

The dashboard owns internal staff workflows over the order data.

The public website may create new orders, but it should not expose dashboard reads or operational management actions.

### Data Boundary

The public website can write new order submissions through a server-side API.

The dashboard reads and mutates operational order data.

The browser must not receive direct database credentials.

For MVP:

```txt
Customer submits public order form
-> public app server route validates input
-> public app writes order to Supabase Postgres
-> public app sends WhatsApp notification
-> dashboard reads order from Supabase Postgres
```

Future refinement may move order creation into a dedicated backend/API worker if the boundary needs to be stricter.

### Storage

Prescription images or files should not be stored publicly.

Use private object storage, preferably Cloudflare R2.

The dashboard should access prescription files through signed, short-lived URLs generated server-side.

### Shared Code

The dashboard may share:

- design tokens
- fonts
- brand colors
- order status/domain types
- state-machine transition rules
- formatting helpers if useful

The dashboard should not share:

- public website layout
- public navbar
- public footer
- promo banner
- catalog navigation
- SEO page structure

## Implementation Plan

### Phase 1 - Decision and POC Extraction

1. Create this ADR.
2. Keep the current `/dashboard` POC temporarily as reference only.
3. Create a separate dashboard app target.
4. Copy/adapt dashboard POC UI into the new app.
5. Copy minimal design tokens from `src/globals.scss`.
6. Remove public website shell dependencies from the dashboard.

### Phase 2 - Cloudflare Access

1. Add `dashboard.farmaciaduret.online` DNS/subdomain in Cloudflare.
2. Deploy the dashboard as a separate Cloudflare Worker.
3. Configure Cloudflare Access for `dashboard.farmaciaduret.online/*`.
4. Add an allow policy for the initial staff emails.
5. Confirm unauthenticated users cannot reach the dashboard.
6. Add server-side Cloudflare Access token validation in the dashboard app.

### Phase 3 - Database

1. Create Supabase project.
2. Add Postgres schema based on ADR 003:
   - `orders`
   - `order_items`
   - `transitions`
   - `users`
   - `coverages`
3. Add migrations using Drizzle.
4. Add application-level order transition service.
5. Ensure `orders.status` and `transitions` are written in the same transaction.
6. Seed the initial staff user records mapped to Cloudflare Access identities.

### Phase 4 - Dashboard MVP

1. Replace JSON fixture data with DB reads.
2. Build order list page.
3. Build order detail page.
4. Add allowed transition actions.
5. Record the authenticated staff user as transition actor.
6. Add basic filtering/search.
7. Add audit/history display from `transitions`.

### Phase 5 - Public Order Integration

1. Update `/orders` public submission route to create a DB order.
2. Store prescription image/file in private R2 if applicable.
3. Save the private object reference on `orders.prescription_url`.
4. Continue sending WhatsApp notification.
5. Ensure public route can create orders but cannot read dashboard data.

## Consequences

### Benefits

- Stronger security boundary between public site and internal back office.
- Cloudflare blocks unauthorized dashboard traffic before it reaches the app.
- Public catalog deployment risk is separated from dashboard deployment risk.
- Dashboard can evolve independently.
- The internal app avoids unnecessary public website layout, SEO, and navigation.
- The model fits future dashboard sub-routes cleanly.

### Costs

- Slightly more deployment setup.
- Some duplication or sharing strategy is needed for design tokens and domain types.
- Public order creation and dashboard order management need a clear shared database contract.
- Local development may require running two apps.

### Risks

- If shared code is copied manually for too long, public and dashboard domain types may drift.
- Cloudflare Access must be configured correctly; the app should still validate Access identity server-side.
- Supabase Free is acceptable for POC but may not be sufficient for production medical/order data because of limited backups, logs, and project pausing.

## Production Notes

Before production use with sensitive medical/order data:

- Confirm legal/compliance requirements for handling prescription and patient information.
- Upgrade Supabase if daily backups and non-pausing behavior are required.
- Keep all database credentials server-side only.
- Use private R2 buckets for prescription files.
- Generate signed URLs server-side only.
- Avoid logging patient details or prescription data.
- Add audit logs for order state changes.
- Validate Cloudflare Access identity inside the dashboard app.
