# WhatsApp webhook

Meta calls `/api/whatsapp/webhook` in two ways. The `GET` request is the subscription handshake: the app echoes `hub.challenge` when `hub.verify_token` matches. The `POST` request delivers message and status events: the app logs a summary and answers `{ "ok": true }`.

## Sub-features

- `webhook-verify`: a `GET` with mode `subscribe` and the right token returns the challenge with status 200.
- `webhook-forbid`: a `GET` with a wrong token returns 403 `Forbidden`.
- `webhook-event`: a `POST` with a JSON event returns `{"ok":true}` and logs `[whatsapp:webhook] event received`.
- `webhook-bad-json`: a `POST` with an invalid body returns 400 `{"ok":false,"error":"Invalid JSON"}`.

## How to get to it (user POV)

- The user is Meta's webhook caller, not a person in the browser. Drive it with `curl` against the app.

## Driving it with browser.mjs

Preconditions:

- Doctor is all `ok`. Doctor itself proves `webhook-verify` with the challenge `doctor-ok`.
- The verify token for this run is `verify-webhook-token`.

- **Verify.** Run `curl -s -w ' %{http_code}\n' "http://localhost:4310/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=verify-webhook-token&hub.challenge=abc123"`. The output is `abc123 200`.
- **Forbid.** Repeat with `hub.verify_token=wrong`. The output is `Forbidden 403`.
- **Event.** Run `curl -s -X POST -H 'Content-Type: application/json' -d '{"object":"whatsapp_business_account","entry":[{"changes":[{"field":"messages","value":{"statuses":[{"id":"wamid.verify","status":"delivered"}]}}]}]}' http://localhost:4310/api/whatsapp/webhook`. The output is `{"ok":true}`, and `.verify/run/app.log` has a `[whatsapp:webhook] event received` line.
- **Bad JSON.** Run `curl -s -w ' %{http_code}\n' -X POST -d 'not json' http://localhost:4310/api/whatsapp/webhook`. The output ends in `400`.
- **Proof.** Save each command and its output to `<evidence>/webhook.txt`.

## Gotchas

- This run's token is `verify-webhook-token`, not the real `WHATSAPP_WEBHOOK_VERIFY_TOKEN` from `.env.local`.
- The app log is copied to `<evidence>/logs/app.log` only when `down.sh` runs. Read `.verify/run/app.log` while the run is up.
