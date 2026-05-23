# ADR 003 — Order management data model
 
**Date:** 2026-05-12
**Status:** Accepted (data model only — persistence layer deferred to ADR 004)
 
## Context
 
Per ADR 002, the admin dashboard needs a database to handle orders and their state changes. The catalog stays as static JSON. Before picking a persistence layer, we needed to lock in the data model.
 
The order is the central entity. Its lifecycle is a 9-state machine (per the Excalidraw diagram), with all transitions driven by pharmacist actions in the dashboard. Patients are anonymous — contact info travels on the order, not a separate Patients table.
 
Three patterns shape the model:
 
- **Transitions table** (à la GoCardless Statesman): every state change is an append-only row; current state denormalized on `orders` for query speed.
- **Snapshot pricing**: `order_items` store `unit_price` and `product_name` at the moment of pricing, not FKs to a mutable catalog. Once `pricing_locked_at` is set, items become immutable.
- **Identity-based table separation**: separate tables for entities with identity outside the parent (`coverages`, `users`); nullable columns for properties without independent identity (payment fields).
## Decision
 
### Five tables
 
1. **`orders`** — one per submission
- Identity: `id` (uuid), `created_at`, `updated_at`
- Current state: `status` (9-value enum, denormalized from transitions), `version` (int, optimistic lock)
- Closure detail: `closure_reason` (enum: `completed | rejected_by_pharmacy | cancelled`), nullable until terminal
- Fulfillment: `fulfillment_method` (enum: `pickup | delivery`), nullable; set at `ready_to_pick_up → delivery|pickup_by_patient`
- Patient contact (no Patients table): `patient_name`, `patient_phone`, `patient_email?`
- Prescription artifact: `prescription_url` (object-store reference)
- Coverage: `coverage_id?` (FK), `coverage_member_num?`
- Pricing snapshot: `subtotal`, `delivery_fee?`, `total`, `pricing_locked_at?`
- Payment (reserved, nullable until in-scope): `payment_method?`, `payment_confirmed_at?`, `payment_confirmed_by_user_id?` (FK users)
2. **`order_items`** — 1 to 6 per order
- `id`, `order_id` (FK)
- Snapshot of product: `product_name` (string, snapshot — NOT FK to catalog), `quantity` (int), `unit_price`, `line_total`
- Per-item state: `status` (enum: `pending | accepted | rejected`)
3. **`transitions`** — append-only event log
- `id`, `order_id` (FK), `from_status`, `to_status`, `actor_id` (FK users), `note?` (text), `metadata?` (json), `created_at`
- Cardinality: 1..N per order (not bounded by state count; depends on path)
- Foundation for: order history view, Telegram notification fan-out, audit / debugging
4. **`users`** — 2 staff for MVP
- `id`, `username`, `password_hash` (string[255] — never `password`), `name`, `role` (enum: `admin | staff`)
5. **`coverages`** — 1 for now, designed to extend
- `id`, `name`, `active` (bool), `contact_info` (json), `created_at`, `updated_at`

### Order states and allowed transitions
 
**The 9 states:**
 
1. `created` — patient submitted the form, awaiting pharmacy review
2. `confirmed_by_pharmacy` — pharmacy validated the script (valid path)
3. `rejected_by_pharmacy` — pharmacy invalidated the script (terminal-ish, leads to `closed`)
4. `in_progress` — pharmacy is gathering stock, validating OS, pricing items
5. `ready_to_pick_up` — items priced and prepared, awaiting fulfillment choice
6. `delivery` — order out for delivery
7. `pickup_by_patient` — patient is picking up in person
8. `payment` — order delivered or picked up, awaiting payment confirmation
9. `closed` — terminal state
**The 10 allowed transitions:**
 
```
created                → confirmed_by_pharmacy        (script is valid)
created                → rejected_by_pharmacy         (script not valid)
confirmed_by_pharmacy  → in_progress                  (pharmacy starts work)
in_progress            → ready_to_pick_up             (items prepared & priced)
ready_to_pick_up       → delivery                     (patient chose delivery)
ready_to_pick_up       → pickup_by_patient            (patient chose pickup)
delivery               → payment                      (delivered)
pickup_by_patient      → payment                      (picked up)
payment                → closed                       (payment confirmed)
rejected_by_pharmacy   → closed                       (auto-close on rejection)
```
 
Any transition not listed above is forbidden. Enforced at the service layer in `transitionOrder()`.

### Sub-state machine for order items
 
Items have their own state (`pending → accepted | rejected`), independent of the parent order's state. Key rules:
 
- The order is **NOT blocked** by a rejected item — pharmacist may reject one medicine (out of stock, unclear script) and continue fulfilling the rest.
- **`orders.total = SUM(order_items.line_total WHERE status = 'accepted') + COALESCE(delivery_fee, 0)`**. Only accepted items are billed.
- If *all* items end up rejected, the order transitions to `rejected_by_pharmacy` (terminal).
- The order can move from `in_progress → ready_to_pick_up` once every item has a non-pending status (every item is either accepted or rejected).
### Money as DECIMAL, not FLOAT
 
All monetary columns use `DECIMAL(12, 2)`. ARS prices typically don't use fractions in practice, but DECIMAL gives exact arithmetic for free and removes float-rounding risk entirely. Free upgrade with zero downside.
 
### State coexistence invariant
 
For every order:
- `orders.status` = source of truth for **current** state (fast reads).
- `transitions` = source of truth for **history** (audit, notifications).
These two MUST be written in the same transaction. A status change without a transition row, or vice versa, is a data integrity bug. This invariant is enforced at the service layer (single `transitionOrder()` function gates all status writes).
 
### What does NOT live in transitions
 
- Pricing (lives on `orders` + `order_items`)
- Payment confirmation (nullable columns on `orders`)
- Current state itself (denormalized on `orders.status`)
Transition `metadata` is reserved for context — rejection reasons, free-text notes, item-level reject details — not for pricing or fulfillment data.
 
## Consequences
 
- Schema is locked and ready to translate to migrations once the DB engine is chosen.
- The `total` rule (excludes rejected items) is enforced at the service layer — a SQL `CHECK` constraint can't filter aggregates cleanly. Recompute on:
  - Item insert / update / delete (only when `pricing_locked_at IS NULL`)
  - Item status change (any time — rejecting an item changes the total even after pricing is locked)
  - `delivery_fee` change
- Telegram notifications hang off transition inserts as a side effect of the `transitionOrder()` function — no separate event bus needed for MVP.
- The 9-state enum lives in TS (single source) and is mirrored as a DB enum or CHECK constraint. Adding a state requires a migration; this is intentional friction.
- `prescription_url` requires an object store. R2 (already on Cloudflare) is the default regardless of DB choice.
## Open questions — for ADR 004 (Persistence layer)
 
Decide tomorrow:
 
### 1. Database engine
 
Coupled to the auth decision because some candidates bundle auth.
 
| Candidate | Pros | Cons |
|---|---|---|
| **Cloudflare D1** (SQLite at edge) | Already on Workers, no new vendor, simplest deploy, free tier generous | Limited concurrent writes, no JSON type richness, no built-in auth |
| **Supabase** (Postgres + Auth + Storage) | Built-in auth + RLS removes Auth.js entirely, full Postgres power, object storage included | Separate network from Workers (latency hop), heavier stack, vendor lock-in |
| **Neon** (serverless Postgres) | Full Postgres, branchable DBs for previews, pairs cleanly with Auth.js | Network hop from Workers, no built-in auth |
| **Turso** (libSQL, distributed SQLite) | Edge-friendly, full SQL, cheap | Newer ecosystem, no built-in auth |
 
### 2. Auth strategy
 
Tightly coupled to (1):
- If **Supabase** → use Supabase Auth (email/password + RLS). Skip Auth.js entirely. Trade: Auth.js is more portable; Supabase Auth is one less moving part.
- If **D1 / Neon / Turso** → Auth.js v5 with credentials provider + DB-backed sessions. 2 staff users, credentials is simpler than magic-link.
### 3. ORM
 
Drizzle is the working assumption (works with all four DB candidates). Confirm choice in ADR 004 and lock the migration tooling.
 
### 4. Object storage
 
R2 for `prescription_url` regardless of DB. Sign URLs server-side; never expose the bucket publicly.
 
---
 
## Tomorrow's first move
 
Read this, then jump straight into the DB decision. Once that's locked, the migration files are mechanical translation.