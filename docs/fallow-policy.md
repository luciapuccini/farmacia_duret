# Fallow Policy

This repository uses full-repo Fallow analysis for maintenance and `fallow audit` as the PR gate.

The current repository state is stored in `fallow-baselines/`. Baseline-aware audits compare against those files and use the `new-only` gate so PR checks focus on newly introduced issues.

## Health Thresholds

- `maxCyclomatic`: Fallow default, 20.
- `maxCognitive`: Fallow default, 15.
- `maxCrap`: 120.

The CRAP threshold is intentionally wider than Fallow's default because this is a Next.js storefront with large JSX route and layout components. Fallow estimates CRAP from static reachability when coverage is not provided, which over-penalizes client/page components that are exercised through browser flows rather than direct unit imports. The threshold still catches very risky branch-heavy functions, while the default cyclomatic and cognitive thresholds remain in force.

## Exceptions

- `open-next.config.ts` is a manual entry point because the OpenNext Cloudflare CLI loads it at build/deploy time.
- `@opennextjs/cloudflare` is ignored as a dependency because it is invoked by npm scripts and loads its config dynamically.
- `sass` is ignored as a dependency because Next.js loads it implicitly for `.scss` support.
- CSS module exports named `up` and `down` are ignored because Fallow sees Sass mixin includes from `@include g.up(...)` / `@include g.down(...)` as CSS module exports.

## Local Hook

The tracked hook script is `scripts/pre-commit`. It is installed locally at `.git/hooks/pre-commit` and runs a staged-diff audit before commits:

- `git diff --cached --unified=0 --no-ext-diff --relative | fallow audit --gate all --diff-file - --fail-on-issues`

This intentionally differs from the PR audit:

- local pre-commit only checks staged hunks
- local pre-commit uses `--gate all`, which skips Fallow's base-snapshot attribution pass and avoids the temporary git worktrees created by `new-only` audits
- PR and manual full audits can still use the baseline-aware `new-only` flow
