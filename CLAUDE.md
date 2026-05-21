# Uplift

Uplift is a collection of Claude Code skills for upgrading legacy codebases to an AI-ready state. It audits, fixes, secures, and documents your project — one deliberate step at a time.

## Installation

Copy the `uplift/` directory into your project root, then add this line to your project's `CLAUDE.md`:

```
@uplift/CLAUDE.md
```

## Usage

Invoke skills explicitly using slash commands:

| Command | What it does |
|---|---|
| `/uplift-init` | Scan the project, detect stack, create `docs/uplift/context.md` |
| `/uplift-audit` | Read full source, find and file issues across 5 dimensions |
| `/uplift-fix` | Work through pending issues by category using Superpowers flow (brainstorm → plan → execute) |
| `/uplift-summary` | Generate a session report with before/after counts and next recommendations |
| `/uplift-scan [path]` | Focused re-scan of a specific path or pattern; extends audit coverage without overwriting existing findings |

## Recommended Workflow

```
/uplift-init      ← always start here
/uplift-audit     ← find all issues
/uplift-scan [path]   ← optional: if audit missed areas
/uplift-fix       ← work through all pending issues by priority
/uplift-summary   ← generate report at the end
```

Skip any step that isn't relevant. The order is a recommendation, not a requirement.

## Core Principles

**Never modify code without permission.** Every fix is proposed, explained, and confirmed before being applied.

**Explain decisions like a senior engineer.** Not just what the problem is — why it matters, what breaks if ignored, what the tradeoffs are.

**Recommend one next step at a time.** After each skill completes, surface the single highest-value next action based on what was actually found.

**All output is persisted.** Every finding and fix is written to `docs/uplift/` so the work survives across sessions.

**No tests = explicit warning.** Every fix skill warns if there's no test coverage. You decide whether to proceed.

## Skills Reference

- `skills/uplift-init/SKILL.md`
- `skills/uplift-audit/SKILL.md`
- `skills/uplift-fix/SKILL.md`
- `skills/uplift-summary/SKILL.md`
- `skills/uplift-scan/SKILL.md`
