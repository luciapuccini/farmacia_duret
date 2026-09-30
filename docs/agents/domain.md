# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`AGENTS.md`** at the repo root — project overview, where each thing lives, SEO and content guidelines
- **`README.md`** — stack, commands, local dev and deploy. `AGENTS.md` defers to it for setup, and to `package.json` for the real command list.
- **`.agents/rules/`** — the rules you must follow while working. `developer_preferences.md` is scoped to `*.ts`, `*.tsx`, `*.js`, `*.jsx`.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in

If any of these don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. They get created lazily, when terms or decisions actually get resolved.

> As of now `docs/adr/` and `docs/issues/` have never been created. The `troubleshooting` skill also tells you to check ADRs — same rule: skip quietly.

## File structure

```
/
├── AGENTS.md            # repo-wide agent context
├── README.md            # stack, commands, deploy
├── .agents/             # rules + skills (duplicated in .claude/)
│   ├── rules/
│   └── skills/
├── docs/
│   ├── agents/          # this file — how agents consume docs
│   ├── adr/             # not created yet: 0001-*.md, 0002-*.md
│   ├── issues/          # not created yet: prd.md, NNN-short-title.md
│   ├── brainstorming/   # speculative — not current state, see below
│   └── design/          # visual reference (mockups, static HTML)
└── src/
```

## How much weight each `docs/` folder carries

| Folder | Treat as |
| --- | --- |
| `docs/adr/` | Binding. Decisions already made. |
| `docs/issues/` | Binding for the work in hand. PRDs and sliced issues, written by `write-a-prd` and `prd-to-issues`. |
| `docs/brainstorming/` | **Not** the current system. Unbuilt future architecture (separate dashboard app, Postgres, R2, payments). `index.md` opens with `IGNORE THIS FILE`. Never cite it as how things work today. |
| `docs/design/` | Visual reference only. Carries no behavior contract. |

Nothing in `docs/` describes the current data layer. For that, read the code: static JSON fixtures in `src/services/catalog/data/`, catalog server actions in `src/services/actions/catalog.ts`, route handlers in `src/app/api/`.

## Who writes these docs

No skill writes ADRs — add them by hand when a decision gets resolved. `write-a-prd` creates `docs/issues/prd.md`; `prd-to-issues` slices it into `docs/issues/NNN-short-title.md`. `grill-me` produces no files, it only pushes a decision to the point where it's worth recording.

## Duplicated agent config

`.agents/` and `.claude/` carry the same `rules/` and `skills/`, and their `AGENTS.md` files have drifted apart — each points at its own directory. Skill bodies reference `.agents/`, so prefer it when they disagree, and apply any rule or skill change to both copies. The repo-wide context is the root `AGENTS.md`, not either nested one.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 — but worth reopening because…_
