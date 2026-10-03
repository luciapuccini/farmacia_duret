# Farmacia Duret verification map

This directory is the maintained source for verifying the customer-facing behavior of the Farmacia Duret site. Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- `$V/up.sh` started the run and `$V/doctor.sh` reports only `ok` lines. `V=.claude/skills/verify/scripts`, `B=$V/browser.mjs` (executable; do not prefix with `node` inside a variable, zsh will not split it).
- The app is at `http://localhost:4310` with the verify env. WhatsApp Graph and OpenAI calls go to the fakes on `127.0.0.1:4311`.
- The browser profile is fresh per run: empty basket, no `orders_submissions` rate-limit counter.
- Never drive an instance this run did not start.

## Driving conventions

- Run browser actions through `$B` and API actions through `curl`.
- Prefer `--role` with `--name` over `--text`. Accessible names are Spanish and literal, including the `*` on required fields.
- The browser state persists between commands. Recipes that need a clean basket must say so, or remove items through the UI.
- Desktop viewport is 1280x900. Use `$B viewport 412 915` for mobile-only entry points.

## Proof and skip reporting

- Capture a screenshot of the action and one of the resulting state.
- Any send through WhatsApp needs its matching line in `graph-requests.ndjson`. Any scan needs its matching line in `openai-requests.ndjson`.
- Check `console.ndjson` and report any errors.
- Record the feature ID and the entry point you used for each proof.
- If a path is unreachable, report the command you tried and the precondition that was not met. A skipped entry point is not verified through another path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph that describes the user-visible behavior. It then has exactly four H2 sections, in this order:

1. `Sub-features`
2. `How to get to it (user POV)`
3. `Driving it with browser.mjs`
4. `Gotchas`

## Features

- [Orders](./orders.md): the `/orders` form, which sends an order by WhatsApp. Covers validation, consent and the daily limit.
- [Catalog basket inquiry](./catalog-basket.md): browse the catalog, add up to 5 products, then review and send them from `/basket`.
- [Skin scan](./scan.md): pick a photo on `/scan` and get a streamed cosmetic orientation.
- [WhatsApp webhook](./whatsapp-webhook.md): Meta's verification handshake and event intake at `/api/whatsapp/webhook`.

Not mapped yet:
- `/`, `/contact`, `/privacy` and `/offers`: mostly static content.
- `/dashboard`: not linked from the site and backed by static JSON.
