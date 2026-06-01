# UI Library Backbone

This document defines the first component backbone for a future design library.

The goal is not to migrate yet.

The goal is to:
- name the smallest useful set of reusable components
- map them to existing Sass patterns
- keep variants minimal
- avoid over-modeling early

## Principles

- Start with the smallest understandable set of components.
- Prefer one component that covers roughly 80% of repeated usage.
- Only split into two components when the structure or interaction meaningfully diverges.
- Do not encode page-specific layout into library components.
- Unify interaction language first: hover, focus, radius, border, spacing rhythm.

## Backbone Components

Initial backbone:

1. `Button`
2. `Card`
3. `TextLink`
4. `NavLink`
5. `Field`
6. `Input`
7. `Textarea`
8. `Checkbox`
9. `Chip`
10. `Badge`

Deferred for later:

- `Select`
- `FileUpload`
- `IconButton`
- `PhoneInput`

These are deferred because the current styles are either concentrated in one place, more behavior-heavy, or not yet repeated enough.

## Component Matrix

| Component | Purpose | Current source styles | Shared shape to preserve | Minimal variants | Explicitly not included yet |
| --- | --- | --- | --- | --- | --- |
| `Button` | Primary call-to-action and secondary action control | `src/app/(home)/home.module.scss` `.ctaPrimary` `.ctaSecondary`; `src/app/orders/orders.module.scss` `.btnPrimary` `.btnGhost`; `src/layout/navbar/components/drawer/drawer.module.scss` `.drawerCta`; `src/layout/navbar/navbar.module.scss` `.navEncargo`; `src/app/not-found.module.scss` `.link` | Inline-flex action, strong label, rounded button radius, consistent hover/active motion | `primary`, `secondary` | Pill-only marketing treatments, nav-only links, icon-only controls |
| `Card` | Default bordered surface for repeated content blocks and clickable catalog tiles | `src/app/offers/offers.module.scss` `.card`; `src/app/(catalog)/[category]/components/SubCategoryGrid/SubCategoryGrid.module.scss` `.card`; `src/app/(catalog)/[category]/[subcategory]/components/ProductCatalog/ProductCatalog.module.scss` `.card`; `src/app/(home)/components/CatalogSection/CatalogSection.module.scss` `.cat`; `src/app/contact/contact.module.scss` `.contactCard` `.scheduleCard` `.faqItem` | White/background surface, `1px` border, rounded corners, internal spacing, optional hover elevation for interactive usage | `interactive` | Product media layout, badges, arrows, complex static panels |
| `TextLink` | Inline links inside paragraphs, labels, helper copy, and support content | `src/app/orders/orders.module.scss` `.consentLink` `.limitPhone`; `src/app/contact/contact.module.scss` nested `a`; `src/app/orders/components/InfoPanel/InfoPanel.module.scss` `.phone` | Text emphasis, blue/ink link color, clear hover affordance | none | Navigation hit-area links, CTA links styled like buttons |
| `NavLink` | Navigation links with a padded hit area and active state | `src/layout/navbar/navbar.module.scss` `.navLink` `.subnavLink` `.dropdownLink`; `src/layout/navbar/components/drawer/drawer.module.scss` `.drawerItemButton` | Compact padded control, rounded corners, active state, ink-to-blue hover | `active` state only | CTA nav buttons, brand lockup, dropdown containers |
| `Field` | Standard field wrapper for label, hint, error and control composition | `src/app/orders/orders.module.scss` `.field` `.label` `.hint` `.fieldError` `.req` `.optional` | Vertical stack, compact label rhythm, helper and error text slots | none | Layout rows, section titles, grouped step headers |
| `Input` | Single-line text input | `src/app/orders/orders.module.scss` `.input`; `src/app/orders/orders.module.scss` `.phoneRow input`; `src/app/dashboard/dashboard.module.scss` input styles if later aligned | White background, line border, button radius, blue focus ring, placeholder treatment | none | Compound phone prefix, search-only wrappers, icon wrapper behavior |
| `Textarea` | Multi-line text input | `src/app/orders/orders.module.scss` `.textarea` | Same visual system as `Input`, larger vertical space, resize behavior | none | Character count and page-specific validation messaging |
| `Checkbox` | Standard checkbox control for consent and boolean inputs | `src/app/orders/orders.module.scss` `.consent input[type="checkbox"]` | Small square check, blue checked state, custom border, accessible hit area | none | Full consent card container, legal copy layout |
| `Chip` | Compact filter control for category and product filtering | `src/app/(home)/components/CatalogSection/CatalogSection.module.scss` `.chip` `.chipActive` `.chipCount` | Compact interactive filter, selected/unselected states, small typography, integrated count treatment | none | Full filter bar container, tab-style underline filters |
| `Badge` | Small status or highlight label | `src/app/(catalog)/[category]/[subcategory]/components/ProductCatalog/ProductCatalog.module.scss` `.offerBadge`; `src/app/(home)/components/CatalogSection/CatalogSection.module.scss` `.catTag`; eyebrow-like labels in `home`, `contact`, `orders/components/InfoPanel` | Small high-emphasis label, compact spacing, rounded small surface | none | Live status animation, section eyebrow with leading dot |

## Detailed Specs

### `Button`

Why it exists:
- repeated CTA styling already exists across home, orders, drawer, navbar, and not-found
- these are visually the same family even if color choices drift slightly today

Include now:
- text label
- optional leading or trailing icon
- button or link rendering
- disabled state

Variants:
- `primary`
- `secondary`

Rules:
- `primary` is the default strong CTA pattern
- `secondary` is the default quiet bordered or neutral action pattern
- both variants share radius, font weight, padding logic, and hover motion

Do not include yet:
- pill CTA as a third style
- special nav CTA treatment
- icon-only buttons

Current normalization decisions:
- one shared hover lift behavior for primary actions
- one shared border and text treatment for secondary actions
- one default radius for all buttons

### `Card`

Why it exists:
- repeated bordered surfaces are one of the strongest duplicated patterns in the codebase
- interactive cards already appear in offers, category, subcategory, product, and home catalog sections

Include now:
- base surface
- optional interactive hover behavior
- content slot only

Minimal variant:
- `interactive`

Rules:
- the base card covers static and mostly-static surfaces
- `interactive` adds the shared clickable hover treatment
- image wrappers, arrows, tags, and product-specific internals stay outside the library card

Do not include yet:
- `info`, `catalog`, `product` variants
- dedicated panel component
- specialized media-card structure

Current normalization decisions:
- one default background
- one default border
- one default corner radius family
- one shared interactive hover border color
- one shared shadow behavior for clickable cards

Important note:
- `src/app/offers/offers.module.scss` currently uses a different hover border color than the catalog cards
- the library should pick one hover border color for all clickable cards

### `TextLink`

Why it exists:
- inline links repeat in helper copy, contact details, consent text, and support sections
- these should not be modeled as buttons

Include now:
- inline text link styling
- hover affordance
- visited behavior only if later needed

Variants:
- none

Rules:
- default should be readable inside body text
- hover behavior must be obvious but restrained

Do not include yet:
- nav links
- button-like links
- icon link rows

### `NavLink`

Why it exists:
- nav links repeat across top nav, subnav, dropdowns, and drawer items
- they share the same role even if the containers differ

Include now:
- padded hit area
- hover state
- active state

Variants:
- none

States:
- default
- hover
- active

Rules:
- keep the component narrow in scope: only the clickable item style
- dropdown shells, drawer sections, separators, and CTA nav items stay outside

Do not include yet:
- disclosure toggles
- brand/logo treatment
- mixed CTA nav item

### `Field`

Why it exists:
- the orders page already contains a coherent field wrapper pattern
- this is a clean foundation for all future forms

Include now:
- label slot
- required marker
- hint text
- error text
- control slot

Variants:
- none

Rules:
- `Field` owns vertical spacing between label, control, hint, and error
- `Field` does not own the control styling itself

Do not include yet:
- row layout helpers
- grouped section headings
- stepped form sections

### `Input`

Why it exists:
- one clear input style already exists and should become the default form control language

Include now:
- single-line text input styling
- placeholder styling
- focus state

Variants:
- none

Rules:
- this is the baseline for future search, contact, and order inputs
- wrappers with icons can compose around `Input`, but are not part of `Input` itself yet

Do not include yet:
- prefix/select compound field
- icon wrapper API
- search-specific affordances

### `Textarea`

Why it exists:
- it already shares the same visual language as `Input`

Include now:
- multiline control styling
- resize behavior
- focus state aligned with `Input`

Variants:
- none

Rules:
- `Textarea` should inherit as much as possible from the same control language as `Input`

Do not include yet:
- auto-resize behavior
- character counters

### `Checkbox`

Why it exists:
- the codebase already has one strong custom checkbox treatment
- boolean inputs benefit from being standardized early

Include now:
- checkbox box style
- checked mark
- focus and checked states

Variants:
- none

Rules:
- the component is the control only
- consent-card surface and legal copy should remain external composition

Do not include yet:
- switch/toggle styles
- checkbox cards

### `Chip`

Why it exists:
- the home catalog chip is the clearest reusable filter control shape today
- it already includes the count treatment we are likely to need again

Include now:
- compact filter action
- selected state
- hover state
- optional count

Variants:
- none

Rules:
- `Chip` is defined by the home `CatalogSection` pattern
- `chipCount` is part of the component, not a separate follow-up primitive

Do not include yet:
- tab-style underline filters from product catalog
- full tab panels
- overflow container logic

### `Badge`

Why it exists:
- small labels and promotional markers repeat enough to warrant a shared base

Include now:
- compact label surface
- strong small-type emphasis

Variants:
- none

Rules:
- keep it generic and minimal
- status animation or eyebrow-with-dot patterns should stay separate for now

Do not include yet:
- live pulse badges
- section eyebrow component

## Explicit Non-Goals For V1

These patterns exist, but should not be part of the first backbone:

1. `IconButton`
Reason: repeated, but still tied to local behaviors like menu toggle, drawer expansion, and card arrow affordances.

2. `Select`
Reason: only clearly appears inside the phone input composition right now.

3. `FileUpload`
Reason: good candidate later, but still concentrated in one form flow.

4. `PhoneInput`
Reason: useful composition, but not yet repeated enough to define as a backbone primitive.

5. `Panel`
Reason: contact and dashboard surfaces are related to cards, but not repeated with enough consistency yet.

## Normalization Backlog

These are the design decisions to settle before migration starts.

1. Choose one hover border color for all interactive cards.
Current conflict:
- `src/app/offers/offers.module.scss` uses `var(--blue-500)`
- catalog-style cards use `oklch(0.62 0.13 235 / 0.4)`

2. Choose one primary CTA visual language.
Current conflict:
- some primary CTAs are blue
- `src/layout/navbar/navbar.module.scss` `.navEncargo` is dark by default

3. Choose one secondary button treatment.
Current conflict:
- home secondary CTA uses bordered white
- orders ghost button uses transparent soft hover

4. Choose one default field radius and focus behavior for all form controls.

5. Choose one inline text-link hover behavior.
Current conflict:
- some links change color only
- some underline on hover
- some use border-bottom emphasis

## Extraction Order

Recommended order once implementation starts:

1. `Card`
2. `Button`
3. `Field`
4. `Input`
5. `Textarea`
6. `Checkbox`
7. `TextLink`
8. `Chip`
9. `NavLink`
10. `Badge`

Reasoning:
- `Card` and `Button` provide the fastest visible consistency wins
- form primitives are already coherent and low-risk to standardize
- navigation is reusable, but still more coupled to behavior and containers

## Quick Mapping Summary

If we reduce the current codebase to the smallest understandable backbone, it becomes:

- repeated strong actions -> `Button`
- repeated bordered surfaces -> `Card`
- repeated inline link treatment -> `TextLink`
- repeated nav item treatment -> `NavLink`
- repeated label/control/error wrapper -> `Field`
- repeated text control -> `Input` and `Textarea`
- repeated boolean control -> `Checkbox`
- repeated compact filters -> `Chip`
- repeated small highlight labels -> `Badge`

That is the first reusable UI library surface this project already justifies.
