# Uplift — Example Output

This file shows what real uplift output looks like. Use it to understand the expected format
before running any skill. All examples are synthetic — not from a real project.

---

## Part 1: context.md (after `/uplift-init`)

```markdown
# Project Context
Generated: 2026-05-22

## Stack
- **Language:** TypeScript 5.3
- **Framework:** Express 4.18
- **Runtime:** Node.js 20.11
- **Package manager:** npm

## Structure
The project is organized into `src/` (application code), `test/` (unit and integration tests),
and `scripts/` (one-off migration helpers). The main entry point is `src/index.ts`. Route
handlers live in `src/routes/`, database access in `src/db/`, and shared types in `src/types/`.

## Dependencies
- **Direct:** 14
- **Dev:** 22
- **Notable:** `pg` (PostgreSQL driver), `jsonwebtoken` (JWT auth), `bcrypt` (password hashing)

## Test Coverage
Minimal (< 20% of files have tests)
Jest is configured; tests exist under `test/` but only cover two utility modules.

## Documentation
- README: exists and useful
- .env.example: exists but incomplete (missing DATABASE_URL key)

## Gaps
- No test coverage for route handlers or database layer
- `.env.example` is missing `DATABASE_URL`
```

---

## Part 2: Issue files (after `/uplift-audit`)

### Security issue — with `Secrets-related: yes`

**File:** `docs/uplift/security/2026-05-22-hardcoded-stripe-api-key.md`

```markdown
# Hardcoded Stripe API Key

**Severity:** critical
**Secrets-related:** yes

**File:** src/config/payments.ts (line 4)

**Impact:** Stripe secret key is committed to source; anyone with repo access can make charges
or read customer data.

## Problem

The Stripe secret key is hardcoded as a string literal directly in `src/config/payments.ts`.
Because this file is committed to version control, anyone who has ever cloned the repository
has access to the live key — including former employees and anyone who finds the repo if it is
ever made public. Stripe considers a key compromised the moment it appears in any commit,
not just the current HEAD.

## Suggested Fix

Revoke the current key in the Stripe dashboard immediately — do not wait until the code is
fixed. Then replace the hardcoded value with `process.env.STRIPE_SECRET_KEY`. Add the key to
`.env` (which is already gitignored) and add it to `.env.example` as an undocumented placeholder.

---

**Status:** pending
```

### Refactor issue — no `Secrets-related`

**File:** `docs/uplift/refactor/2026-05-22-god-object-user-service.md`

```markdown
# God Object: UserService

**Severity:** low

**File:** src/services/UserService.ts (line 1–412)

**Impact:** The file handles authentication, profile updates, email sending, and audit logging —
all in one class — making it hard to test, modify, or understand any single concern.

## Problem

`UserService.ts` has grown to 412 lines across 14 public methods spanning four distinct
responsibilities: authentication (login, logout, token refresh), profile management (update,
avatar upload), email notifications (welcome, password reset), and audit logging. Any change
to one area requires reading and understanding the entire file, and tests for one concern
inadvertently depend on setup from another.

## Suggested Fix

Split into four focused services: `AuthService`, `ProfileService`, `EmailService`, and
`AuditService`. Extract each group of methods with its dependencies. Update the DI container
and call sites. This is a mechanical refactor — no logic changes needed.

---

**Status:** pending
```

---

## Part 3: UPLIFT.md (after `/uplift-audit`)

```markdown
# Uplift Audit Results
Generated: 2026-05-22

## Recommended Next Step

**`/uplift-fix`** — one critical security issue (hardcoded Stripe key) must be addressed before
any other work; the secret may already be compromised.

> **No test coverage for route handlers.** Proceeding with code changes to those files is
> high-risk. Consider writing tests before running any fix skill on `src/routes/`.

## Summary

| Category | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Bugs | 0 | 1 | 2 | 1 | 4 |
| Security | 1 | 0 | 1 | 0 | 2 |
| Performance | 0 | 1 | 0 | 0 | 1 |
| Refactor | 0 | 0 | 1 | 1 | 2 |
| AI-Readiness | 0 | 0 | 2 | 0 | 2 |

## Issue Index

### Bugs

| Title | Severity | Status | Impact |
|---|---|---|---|
| [Missing await in createOrder](bugs/2026-05-22-missing-await-create-order.md) | high | pending | Order may be returned before DB write completes |
| [Null dereference on unauthenticated request](bugs/2026-05-22-null-dereference-unauth.md) | medium | pending | 500 error returned instead of 401 |
| [Off-by-one in pagination](bugs/2026-05-22-off-by-one-pagination.md) | medium | pending | Last item on page is sometimes omitted |
| [Wrong HTTP 200 on validation failure](bugs/2026-05-22-wrong-200-on-validation.md) | low | pending | Clients cannot distinguish success from validation error |

### Security

| Title | Severity | Status | Impact |
|---|---|---|---|
| [Hardcoded Stripe API Key](security/2026-05-22-hardcoded-stripe-api-key.md) | critical | pending | Live Stripe key committed to source; treat as compromised |
| [Missing input validation on /api/users](security/2026-05-22-missing-validation-users.md) | medium | pending | Malformed input can crash the request handler |

### Performance

| Title | Severity | Status | Impact |
|---|---|---|---|
| [N+1 query in order listing](performance/2026-05-22-n-plus-one-orders.md) | high | pending | Each order triggers a separate DB call; degrades with volume |

### Refactor

| Title | Severity | Status | Impact |
|---|---|---|---|
| [300-line getUser handler](refactor/2026-05-22-long-get-user-handler.md) | medium | pending | Hard to test or modify any single responsibility |
| [God Object: UserService](refactor/2026-05-22-god-object-user-service.md) | low | pending | Four concerns in one file; slows down every change |

### AI-Readiness

| Title | Severity | Status | Impact |
|---|---|---|---|
| [Magic number 86400 in token expiry](ai-readiness/2026-05-22-magic-number-token-expiry.md) | medium | pending | Unclear to readers what the value means or where it is used |
| [Abbreviations in db layer: mgr, proc, tmp](ai-readiness/2026-05-22-abbreviations-db-layer.md) | medium | pending | AI agents and new engineers cannot infer meaning without reading callsites |

## Dependency Order

Fix the Stripe key first — it is an active security risk and requires credential rotation before
touching any payment code. Then fix `missing-await-create-order`, which touches the same order
creation path; doing the security fix first avoids rebasing over payment logic twice. The N+1
query fix can follow independently. Refactor and AI-Readiness issues have no order dependencies
and can be done in any sequence after the critical items are resolved.

## Scan Coverage

| Date | Method | Target | Files | Status |
|---|---|---|---|---|
| 2026-05-22 | direct read | full project | 34/34 | complete |

### Gaps

No gaps — all source files were scanned.
```

---

## Part 4: SUMMARY (after `/uplift-summary`)

**File:** `docs/uplift/SUMMARY-2026-05-22.md`

```markdown
# Uplift Summary
Date: 2026-05-22
Project: my-express-api

## What Changed

- **Hardcoded Stripe API Key** (`security`, critical) — replaced hardcoded string with
  `process.env.STRIPE_SECRET_KEY`; key rotated in Stripe dashboard before code change.
- **Missing await in createOrder** (`bugs`, high) — added `await` before `db.insert()` call;
  prevents order-before-write race condition.
- **N+1 query in order listing** (`performance`, high) — replaced per-item query inside loop
  with a single batched `SELECT ... WHERE id = ANY($1)` call.

## Results

| Category | Found | Fixed | In-Progress | Pending | Skipped |
|---|---|---|---|---|---|
| Bugs | 4 | 1 | 0 | 3 | 0 |
| Security | 2 | 1 | 0 | 1 | 0 |
| Performance | 1 | 1 | 0 | 0 | 0 |
| Refactor | 2 | 0 | 0 | 2 | 0 |
| AI-Readiness | 2 | 0 | 0 | 2 | 0 |

> "Skipped" counts issues the user explicitly declined during a fix skill session.

## Pending Issues

- **Null dereference on unauthenticated request** (`bugs`, medium) — returns 500 instead of 401;
  affects any unauthenticated caller.
- **Off-by-one in pagination** (`bugs`, medium) — last item sometimes omitted; affects all
  paginated endpoints.
- **Wrong HTTP 200 on validation failure** (`bugs`, low) — clients cannot distinguish success
  from error responses.
- **Missing input validation on /api/users** (`security`, medium) — malformed input can crash
  the handler.
- **300-line getUser handler** (`refactor`, medium) — hard to test or modify safely.
- **God Object: UserService** (`refactor`, low) — four concerns in one class.
- **Magic number 86400 in token expiry** (`ai-readiness`, medium) — meaning is opaque to readers.
- **Abbreviations in db layer** (`ai-readiness`, medium) — `mgr`, `proc`, `tmp` are not
  self-documenting.

## Skipped Issues

No issues were explicitly skipped.

## AI-Readiness

Before: CLAUDE.md did not exist
After: CLAUDE.md created by `/uplift-init` (structural setup — no ai-readiness issue marked done)

The codebase has not yet improved in AI-readiness this session. The two pending ai-readiness
issues (magic number, abbreviations) remain unaddressed.

## Recommended Next Steps

1. `/uplift-fix` — 4 bugs pending (null dereference and pagination are medium severity;
   straightforward to fix with tests)
2. `/uplift-fix` — 1 security issue pending (input validation on /api/users)
3. `/uplift-fix` — 4 refactor and ai-readiness issues pending (low risk, good candidates for
   fast-track)
```
