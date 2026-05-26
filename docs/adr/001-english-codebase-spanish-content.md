# ADR 001 — English codebase, Spanish content

**Date:** 2026-05-12
**Status:** Accepted

## Context

The site serves a Spanish-speaking community. The codebase accumulated a mix of Spanish and English identifiers because some route folder names were originally kept in Spanish so URLs would read naturally to users. This bled into TypeScript types, variable names, JSON property keys, and form field names, making the code inconsistent and harder to follow for any developer who expects English identifiers.

A full i18n setup (e.g. `next-intl`) was evaluated but rejected as over-engineered for a project that will never serve a second language.

## Decision

**Code identifiers are English. User-visible content is Spanish.**

| Layer | Language | Examples |
|---|---|---|
| File & folder names | English | `contact/`, `orders/`, `route.ts` |
| URL routes | English | `/contact`, `/offers`, `/orders` |
| TypeScript identifiers | English | `name`, `subcategories`, `phone`, `notes` |
| JSON data keys | English | `"name"`, `"subcategories"` |
| HTML form field names | English | `name="phone"`, `name="notes"` |
| User-visible strings (JSX) | Spanish | button labels, headings, copy |
| `<html lang>` attribute | `es` | informs browsers and assistive tech |

Old Spanish URLs redirect permanently to their English equivalents (301) so existing links and search engine rankings are preserved.

Dynamic category URL slugs (`/dermocosmetica`, `/cuidado-personal`, etc.) are generated from Spanish content data (`categories.json` values) and intentionally remain Spanish — they are content, not identifiers.

## Consequences

- All new routes, variables, types, and data keys must use English names.
- Spanish strings in JSX are left as-is; no translation layer is needed.
- The breadcrumb lookup map maps English route keys (`contact`, `offers`, `orders`) to their Spanish display labels.
- If a second language is ever needed, extracting strings into a dictionary (following the Next.js i18n guide) is straightforward since content is already isolated in JSX and JSON values.
