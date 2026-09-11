# TODO

## WhatsApp

- [ ] Improve error surfacing when the Meta Graph access token 401s.
  - On 2026-09-07 orders broke with Graph `code: 190` `OAuthException`, `error_subcode: 467`
    ("The session is invalid because the user logged out") — a temporary user token expiring (~24h).
  - Detect `code: 190` in the `/api/whatsapp/orders` handler and return a clear, actionable error
    (token expired / needs rotation) instead of a generic failure.
  - Add an alert/notification when a token 401 occurs so it's noticed before customers are affected.
  - Fix path: use a permanent System User token with `whatsapp_business_messaging` +
    `whatsapp_business_management` scopes, expiry Never; set via `wrangler secret put WHATSAPP_ACCESS_TOKEN`.
