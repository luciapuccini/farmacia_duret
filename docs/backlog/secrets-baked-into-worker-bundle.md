# Secrets are compiled into the deployed Worker bundle

Status: open · Found 2026-09-30 · Area: build / deploy

## What happens

`opennextjs-cloudflare build` generates `.open-next/cloudflare/next-env.mjs` by replaying
Next.js' own env loading, which includes `.env.local`. Every variable found there is written
into that file as a plaintext literal and shipped with the Worker.

At the time of writing the generated file contains values for:

- `OPENAI_API_KEY`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

They appear under both the `production` and `development` exports, because `.env.local`
applies to both.

Reproduce with:

```bash
npm run build:cf
grep -o '^export const [a-zA-Z]*' .open-next/cloudflare/next-env.mjs
# then inspect the object keys — values are plaintext
```

## Why it matters

- The values live in the build artifact instead of Cloudflare's secret store, so they are
  retained in the history of every deployed Worker version.
- They also sit in plaintext in local build output. `.open-next` is gitignored, so nothing
  has been committed, and the bundle is not publicly downloadable — this is not an internet
  exposure, but it is the wrong place for them.
- It hides missing configuration. `OPENAI_API_KEY` is **not** set as a Cloudflare secret in
  either environment (`npx wrangler secret list --env stg|production` shows only the two
  `WHATSAPP_*` secrets). `/scan` works anyway purely because the key is baked in, so the
  `!apiKey` guard in `src/app/scan/scan.ts` never trips and the gap goes unnoticed.

## Fix path

1. Rotate the three values above. They are issued by OpenAI and Meta, so this has to be done
   in their consoles.
2. Set them as real secrets, per environment:

   ```bash
   npx wrangler secret put OPENAI_API_KEY --env stg
   npx wrangler secret put OPENAI_API_KEY --env production
   ```

3. Keep secret values out of `.env.local` so builds stop picking them up — either move local
   development onto `.dev.vars` (already gitignored, and what `wrangler dev` reads), or keep
   `.env.local` limited to non-secret vars.
4. Re-verify `/scan` and the WhatsApp routes afterwards: with nothing baked in, they must read
   from the Cloudflare secret store, which is the behaviour we actually want to confirm.
5. Consider a guard so this cannot regress silently — e.g. a build step that greps
   `.open-next/cloudflare/next-env.mjs` for known secret names and fails if any have values.

## Notes

Unrelated to the secrets themselves, but surfaced by the same commands and worth folding into
the same cleanup: `env.production` does not inherit several top-level bindings. The production
deploy on 2026-09-30 warned about `services`, `r2_buckets` and `images`, none of which are
declared under `env.production`, while `env.stg` declares them explicitly. That means production
is likely running without the `WORKER_SELF_REFERENCE` service binding and the `IMAGES` binding
that staging has. `assets` is inherited and works in both. Verify and mirror the stg block into
`env.production` in `wrangler.jsonc`.
