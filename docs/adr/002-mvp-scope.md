# ADR 002 — Admin dasboard

**Date:** 2026-05-12
**Status:** Accepted

## Context

The current problem of the client is not related to only shopping of products. The catalog (categories & products) is read-only content, very static, only useful as a reference and a brand recognition / status filler. good to have for SEO Serps, but not relevant to their main problem.
The principal feature we wan to target now is the process of ordering medicine and helping the pharmasist follow up with patients. Payment and recipts could be part of the process, need to confirm.

## Decision

**Stick to static catalog JSON files. Create a DB for Admin dashboard and orders management**

- order management is an INTERNAL process. patients do not feel recurring, so contact info will be handled as part of the Order class. This means that the patients info will NOT be stored in a "Patients" table, patients are not part of the auth/ ordering process.
- all state changes for the MVP will be triggerd by the pharmacy with a button in the dashbaord. it could be nice to hint them, but we need their initial confirmation even for payments
- payments are mostly out of scope, we could have a simple back transfer suggestion. So at most send a telegram to patient once order is ready to pay to account number X, and have pharmacy manually confirm transfer made OK

## Consequences

- Create new separated process for ordering process: TBD, but over all when a patient fills the form, trigger a processs that:
  1. create a new order
  2. on state chages, push telegram messages to order phone number / email
- dashboard to consume orders -- CRUD
- choose auth startegy & architecure
- DB will handle orders as a machine state for tracking
- DB will have users, but super lean implementation (only 2 staff members)
- notification system for traking updates is nice to have. (push telegram msg to patients)

## Machine state design in excalidraw
