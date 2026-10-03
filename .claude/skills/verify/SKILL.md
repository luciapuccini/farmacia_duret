---
name: verify
description: Launch and drive the Farmacia Duret Next.js site (web UI plus its /api routes) in a real headless Chromium, with WhatsApp Graph and OpenAI replaced by local recording fakes, and capture screenshots, ARIA snapshots, network and outbound-API evidence. Use to prove a UI or API change works the way a customer sees it (orders, catalog basket inquiry, skin scan, webhook), not just that tests pass.
---

# Verify Farmacia Duret

The primary surface is the web UI served by `next dev`. The API routes under `/api/*` are a second surface that you drive with `curl`. The run never talks to Meta or OpenAI:

- `fakes.mjs` (port 4311) plays the WhatsApp Graph API and the OpenAI Responses API, and records every request it receives.
- `graph-redirect.mjs` is preloaded into the Next process and rewrites `https://graph.facebook.com/...` to the fake. The Graph URL is hardcoded in `src/app/api/whatsapp/service.ts`.
- `OPENAI_BASE_URL` points the OpenAI SDK at the fake.
- All tokens are replaced with `verify-fake-*` values. If a redirect ever fails, Meta or OpenAI rejects the call instead of sending a message.

Every WhatsApp send goes to the customer's phone number, so a real send messages a real person. Never start the app with the real `.env.local` credentials to "check it for real" without the user's explicit approval.

All commands run from the repo root. Set `V=.claude/skills/verify/scripts` and `B=$V/browser.mjs` (executable; do not prefix with `node` inside a variable, zsh will not split it).

## Launch

```bash
$V/up.sh
```

This starts three process groups and writes `.verify/run/state.json`:

| Process | Port | Log |
| --- | --- | --- |
| fakes (`fakes.mjs`) | 4311 | `.verify/run/fakes.log` |
| app (`next dev -p 4310`, verify env) | 4310 | `.verify/run/app.log` |
| browser (`browser-daemon.mjs`, persistent headless Chromium with a fresh profile) | 4312 (CDP) | `.verify/run/browser.log` |

The run is ready when `up.sh` prints `verify run <id> is up` along with the app URL and the evidence directory. The first page compile takes about 2 seconds. Override the ports with `VERIFY_APP_PORT`, `VERIFY_FAKES_PORT` and `VERIFY_CDP_PORT`.

`up.sh` refuses to start in these cases:
- A run is already up.
- One of its ports is taken.
- Another `next dev` for this repo is running. Next allows one dev server per project directory. Do not kill the user's dev server. Tell them about it instead.

Only one verify run can exist per checkout. Use a separate worktree for parallel runs.

## Doctor

```bash
$V/doctor.sh
```

Read-only. Run it first, and again whenever something looks off. Every line must say `ok`:

- The app, fakes and browser processes are alive.
- Each port is held by this run's processes, not by someone else's.
- `GET /` answers 200.
- The webhook answers the verify token, which proves the app runs with the verify env and not the real `.env.local` secrets.
- The Graph redirect preload is active in the process that serves port 4310.
- The evidence directory exists.

A `warn` about git HEAD means the code changed since launch. `next dev` hot-reloads, so the run is still usable, but say so in the report. Any `FAIL` means you stop driving: run `$V/down.sh`, then `$V/up.sh`.

## Drive

`browser.mjs` drives the single page of the persistent browser over CDP. State (URL, localStorage, form values) carries over between commands, like one user clicking through. Run `$B` without arguments for usage.

```bash
$B goto /orders
$B fill --role textbox --name "Nombre completo*" --value "Verify Cliente"
$B fill --label "Email" --value "verify@example.com"
$B click --role button --name "Enviar por WhatsApp"
$B expect --text "Encargo enviado por WhatsApp"
$B expect --text "Enviando" --gone
$B check --role checkbox --name "..."     # also: uncheck
$B upload --label "Elegir una foto" --file e2e/fixtures/skin-photo.jpg
$B press --key Enter
$B viewport 412 915                        # Pixel 7 size, for mobile layouts
$B screenshot orders-sent [--full]
$B aria orders-sent                        # ARIA snapshot to a file, also printed
$B storage                                 # localStorage as JSON
$B url
```

- Targets are `--role R --name N`, `--label L` or `--text T`. Add `--exact`, `--nth i` or `--timeout ms` (default 10000) as needed.
- Prefer role and accessible name. The UI is Spanish, and the names in `features/*.md` and `e2e/*.spec.ts` are the real ones.
- A failing command exits 1 and prints `FAILED <command>: <reason>`. Take an `aria` snapshot to see what is really on the page before retrying.

Drive API routes directly with `curl http://localhost:4310/api/...`.

To force the next outbound call to fail, which covers error paths through the real route:

```bash
curl -X POST http://127.0.0.1:4311/__control/fail-next/graph    # next Graph send returns 400
curl -X POST http://127.0.0.1:4311/__control/fail-next/openai   # next OpenAI call returns 500
curl http://127.0.0.1:4311/health                               # request counts per fake
```

The feature recipes are in [features/README.md](features/README.md). If the change touches a mapped feature, drive every entry point the map lists for it, not only the most convenient one.

## Evidence

Each run writes to `.verify/evidence/<run-id>/` (gitignored):

| File | Contents |
| --- | --- |
| `screenshots/NN-<name>.png`, `aria/NN-<name>.txt` | What you capture with `screenshot` and `aria`. |
| `actions.ndjson` | Every `browser.mjs` command, with its URL and pass/fail result. |
| `network.ndjson` | Browser requests to `/api/*` and their responses. Image bytes are omitted. Streamed `/api/scan` bodies are not readable here. |
| `graph-requests.ndjson` | Every WhatsApp template the app sent: recipient, template name and parameters. This is the side-effect proof for orders and basket inquiries. |
| `openai-requests.ndjson` | Every OpenAI Responses call, with the image data URL truncated. |
| `console.ndjson` | Browser console errors and page errors. Check it on every run. |
| `logs/` | App, fakes and browser logs, copied there by `down.sh`. |

Proof standards:

- Exercise the real user path: click and type in the real page. Do not use `page.route` mocks, do not seed localStorage when a user path exists, and do not call internal setters.
- Capture the action and the resulting state. Take a screenshot before submitting, then one of the result.
- Verify side effects as well as the screen. A successful order means a new line in `graph-requests.ndjson` with the typed values, not only a success banner.
- The fakes stand in only at the Meta and OpenAI boundary. Everything from the browser through the Next route handler is real code.
- Report what you did not verify (real Meta template approval, real model output, the Cloudflare Workers runtime) instead of implying it.

## Cleanup

```bash
$V/down.sh
```

`down.sh` does the following:
- Kills only the process groups this run recorded: browser daemon, Chromium, app and fakes.
- Copies the logs into the evidence directory.
- Restores `AGENTS.md` if it was clean before launch. `next dev` appends a `nextjs-agent-rules` block to `AGENTS.md`.
- Removes `.verify/run/`.

It never deletes `.verify/evidence/`. Run it after every attempt, failed ones included. Never kill processes by name.

## Helpers

All helpers are in `scripts/` and are executable:

| Script | Purpose |
| --- | --- |
| `up.sh`, `doctor.sh`, `down.sh` | Launch, check and tear down, as described above. |
| `browser.mjs` | Browser driver CLI. |
| `browser-daemon.mjs` | Holds the browser and records network and console traffic. `up.sh` starts it. |
| `fakes.mjs` | Fake Graph and OpenAI APIs. Its canned scan result is in `fixtures/scan-result.json`, and every string in it starts with `Verify:` so you can tell fake output apart on screen. |
| `graph-redirect.mjs` | Node preload that rewrites Graph API URLs to the fake. |
