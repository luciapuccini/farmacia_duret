# ADR 006 - Cloudflare Worker preview deployments

**Date:** 2026-05-23
**Status:** Proposed

## Context

The public application is a Next.js App Router app deployed to Cloudflare as an OpenNext Cloudflare Worker. It is not deployed as a static-only site.

The project needs a deployment model that supports increasing application complexity, including dynamic server behavior, API routes, future durable order storage, and integrations that should be tested before production.

Cloudflare provides two related but different mechanisms:

- Worker preview deployments and preview URLs, which are suitable for isolated pull request and branch testing.
- Wrangler environments, which create named Workers such as `<worker-name>-staging` and are better suited to long-lived environments like `staging`, `qa`, or `demo`.

The team wants to configure just one preview environment class, not a different named Wrangler environment for every pull request.

## Goal

The deployment setup should support this target workflow:

```txt
Each PR gets isolated deployment + preview URL
Production remains farmaciaduret.online
One deploy command in Cloudflare dashboard
Different env vars/secrets for preview vs production
```

Use:

```txt
Cloudflare Workers + Preview URLs + production/preview build variables
```

## Decision

Use Cloudflare Worker preview deployments for pull request and branch validation.

Use the Cloudflare dashboard's production and preview configuration to provide different build variables, runtime variables, and secrets for production versus preview deployments.

Do not use Wrangler environments as the main pull request preview mechanism. Wrangler environments remain available for future long-lived named environments, such as `staging` or `demo`, if the project needs them.

Production remains the top-level Worker deployment configured in `wrangler.jsonc`, routed to:

```txt
farmaciaduret.online
www.farmaciaduret.online
```

Preview deployments should use Cloudflare-generated preview URLs rather than production custom domains.

## Environment Model

There are two deployment classes:

```txt
Production
- Triggered from the production branch.
- Uses production dashboard variables and secrets.
- Deploys to farmaciaduret.online and www.farmaciaduret.online.

Preview
- Triggered from pull requests or non-production branches.
- Uses preview dashboard variables and secrets.
- Deploys to an isolated Cloudflare preview URL.
```

Preview is a class of environment, not a separate hard-coded Wrangler environment per pull request.

Cloudflare-provided variables such as the deployment environment, branch, commit, and preview URL should be preferred for deployment detection when available. Project-specific variables should be added only when the application needs stable names, for example:

```txt
APP_ENV=production
APP_ENV=preview
NEXT_PUBLIC_SITE_URL=https://farmaciaduret.online
```

## Recommended Steps

1. Keep one deploy command configured in the Cloudflare dashboard.
2. Ensure the command builds and deploys the OpenNext Cloudflare Worker without requiring a manual environment argument for pull requests.
3. Configure Cloudflare production variables and secrets for production integrations.
4. Configure Cloudflare preview variables and secrets for safe preview integrations.
5. Point production routes only at the top-level Worker deployment.
6. Confirm pull requests receive Cloudflare preview URLs and do not attach production routes.
7. Add a visible or logged environment marker in preview if useful for debugging, using a non-secret variable such as `APP_ENV=preview`.
8. Keep production-only credentials out of preview unless the integration is explicitly safe to test there.
9. Document any preview-specific third-party resources, such as Contentful preview environments, Meta test apps, Supabase branches, or R2 buckets.
10. Add long-lived Wrangler environments only if the team needs stable named URLs outside the pull request lifecycle.

## Iteration Plan

### Phase 1 - Current Worker Deployment

1. Keep `wrangler.jsonc` focused on the production Worker and production routes.
2. Keep `farmacia-duret` as the production Worker name.
3. Use Cloudflare dashboard production and preview settings to separate environment values.
4. Verify a non-production branch deploys to a preview URL.

### Phase 2 - Preview Safety

1. Replace preview secrets with test or sandbox credentials where integrations support them.
2. Use separate preview data resources for destructive or customer-visible behavior.
3. Disable or sandbox external customer communication from preview deployments.
4. Ensure preview deployments cannot accidentally send production WhatsApp messages.

### Phase 3 - Data Isolation

1. Use preview-safe database credentials when order persistence is introduced.
2. Prefer isolated preview resources for mutable data, especially orders and prescription files.
3. Use separate R2 buckets or prefixes for preview uploads.
4. Add migration and seed-data steps only after the database strategy is chosen.

### Phase 4 - Optional Long-Lived Environments

1. Add a Wrangler environment only for a stable named deployment, such as `staging`.
2. Give the long-lived environment its own Worker name, routes, bindings, and secrets.
3. Do not use long-lived Wrangler environments as a replacement for per-PR preview URLs.

## Consequences

### Benefits

- Pull requests can be tested in isolation before merging.
- Production remains tied to `farmaciaduret.online`.
- The Cloudflare dashboard can keep a single deploy command.
- Production and preview values are configured separately.
- The project avoids creating many hard-coded Wrangler environments for individual pull requests.
- The model can grow into preview-safe databases, storage, and third-party integrations.

### Tradeoffs

- Preview deployments need careful secret and integration setup to avoid production side effects.
- Some third-party systems may require their own preview or sandbox resources.
- Long-lived staging still requires a separate decision if the team needs a stable non-production URL.

## Non-Goals

- This ADR does not choose the future database provider.
- This ADR does not define a dashboard deployment strategy.
- This ADR does not require a long-lived staging environment.
- This ADR does not require creating a Wrangler environment named `preview`.
