# Uplift

A collection of Claude Code skills for upgrading legacy codebases to an AI-ready state.

Uplift audits your project, finds bugs, security issues, and performance problems, and guides you through fixing them — one deliberate step at a time. Works like [Superpowers](https://github.com/obra/superpowers): drop a directory into your project, reference it from your CLAUDE.md, and invoke skills via slash commands.

---

## Installation

**1. Copy the `uplift/` directory into your project root:**

```bash
cp -r uplift/ /path/to/your/project/
```

`uplift/` must live at the project root. All skill output (`docs/uplift/`) is written relative to the project root, not the uplift install location.

**2. Add this line to your project's `CLAUDE.md`** (create one if it doesn't exist):

```
@uplift/CLAUDE.md
```

That's it. Open a Claude Code session in your project and Uplift is ready.

---

## Commands

| Command | What it does |
|---|---|
| `/uplift-init` | Scan the project, detect stack, create `docs/uplift/context.md` |
| `/uplift-audit` | Read full source, find and file issues across 5 dimensions |
| `/uplift-fix` | Work through pending issues by category using Superpowers flow (brainstorm → plan → execute) |
| `/uplift-summary` | Generate a session report with before/after counts and next recommendations |

---

## Recommended Workflow

```
/uplift-init
/uplift-audit
/uplift-fix
/uplift-summary
```

Skip any step that isn't relevant. The order is a recommendation, not a requirement.

---

## Example Session

```
> /uplift-init

Scanning project...
Stack: Node.js + Express + PostgreSQL
Test coverage: none detected
⚠ No README found
Written: docs/uplift/context.md

Recommended next step: /uplift-audit


> /uplift-audit

Reading source files...
Found: 2 critical bugs, 1 critical security issue, 3 high performance issues
Written: 6 issue files across docs/uplift/bugs/, docs/uplift/security/, docs/uplift/performance/
Written: docs/uplift/UPLIFT.md

Recommended next step: /uplift-fix (bugs — 2 critical)


> /uplift-fix

CHOOSE A CATEGORY
[1] security     — 1 critical, 2 high      ← recommended
[2] bugs         — 2 critical, 3 high
[3] performance  — 0 critical, 3 high

Enter number: > 2

bugs — 2 pending
[1] critical  Missing await in payment handler
[2] high      Null dereference on unauthenticated request
[a] Fix all in order

Enter number, "a", or "b": > a

[brainstorming → planning → executing for each issue...]
Both fixed. UPLIFT.md updated.


> /uplift-summary

Fixed: 2 bugs
Pending: 1 critical security, 3 high performance
Written: docs/uplift/SUMMARY-2026-05-21.md

Next recommended action: /uplift-fix (security has 1 critical)
```

---

## Output Files

All output lives in `docs/uplift/` inside your project:

```
docs/uplift/
├── context.md                    ← project context (uplift-init)
├── UPLIFT.md                     ← audit summary and priority table
├── SUMMARY-{date}.md             ← session report (uplift-summary)
├── bugs/
│   └── {date}-{slug}.md          ← one file per bug found
├── security/
│   └── {date}-{slug}.md
├── performance/
│   └── {date}-{slug}.md
├── refactor/
│   └── {date}-{slug}.md
└── ai-readiness/
    └── {date}-{slug}.md
```

Issue files persist across sessions. Run `/uplift-audit` today, fix tomorrow.

---

## Core Principles

**Never modifies code without approval.** Every change is proposed with a diff and an explanation before anything is written.

**Explains like a senior engineer.** Not just "this is a bug" — why it matters, what breaks, what the tradeoff is in fixing it.

**One recommended next step at a time.** Based on what was actually found, not a fixed sequence.

**No tests = explicit warning.** Every fix skill warns if there's no test coverage. You decide whether to proceed.

---

## Compatibility

Works with any harness that supports slash commands and loads `CLAUDE.md` at session start:

- Claude Code (CLI)
- Cursor
- Codex CLI

---

## License

MIT
