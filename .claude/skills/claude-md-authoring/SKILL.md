---
name: claude-md-authoring
description: Creates and refines CLAUDE.md onboarding guidance with concise, reusable instructions. Use when creating, editing, simplifying, or auditing CLAUDE.md files and agent guidance docs.
compatibility: claude-code, opencode
---

# CLAUDE.md Authoring

Applies only when task scope includes creating or editing `CLAUDE.md` files.

## Trigger Conditions

Apply this skill when at least one changed target matches:

- `**/CLAUDE.md`

Do not apply this skill for unrelated code changes.

## Core Principles

1. `CLAUDE.md` is onboarding context for a stateless model.
2. Keep content focused on `WHY`, `WHAT`, and `HOW` of the codebase.
3. Less instruction density is better; include only broadly applicable guidance.
4. Prefer progressive disclosure: point to focused guides instead of embedding everything.
5. Use deterministic tooling (lint/format/test) rather than style prose in agent context.

## Degrees of Freedom

- High freedom: adapt tone and wording to match repo conventions.
- Medium freedom: organize sections when existing docs already use a stable structure.
- Low freedom: enforce invariants (concise scope, valid links, no task-specific runbooks in root files).

## Authoring Rules

- Keep root `CLAUDE.md` concise (target under 300 lines; if approaching 200-300 lines, split details into guides).
- Include only instructions that are useful across most sessions.
- Avoid task-specific playbooks in root context (schema design, one-off migrations, etc.).
- Prefer pointers to canonical docs over copied snippets.
- If conventions are long, move them to `docs/agent-guides/*.md` and link them.
- Avoid using `CLAUDE.md` as a pile of behavior hotfixes.

## Output Contract

When creating or heavily restructuring a root `CLAUDE.md`, use this minimal skeleton:

```markdown
# <Project> Agent Guide

## Why
- Purpose of this repository and operating constraints.

## What
- Monorepo/project map and boundaries.

## How
- Build/test/lint workflow, dependency manager, and safety constraints.

## Progressive Disclosure
- Links to focused guides by task type.

## Local Overrides
- Note that nested `CLAUDE.md` files can add stricter local rules.
```

## Suggested Structure

Use a minimal structure similar to:

1. `Why`: system purpose and high-level goals.
2. `What`: project map (apps, libs, packages, ownership boundaries).
3. `How`: concrete workflows (build/test/lint, dependency manager, safety rules).
4. `Progressive Disclosure`: which guide files to read for specific tasks.
5. Optional local overrides note for nested `CLAUDE.md` files.

## Progressive Disclosure Rules

- Keep references one level deep from the active `CLAUDE.md`.
- Avoid nested reference chains (`A -> B -> C`) for required guidance.
- Prefer domain-focused guide files over broad, mixed-content docs.

## Editing Workflow

1. Read the existing `CLAUDE.md` and nearest local overrides before editing.
2. Draft updates with universal guidance first, then prune low-applicability content.
3. Move narrow details to task guides and link them from progressive disclosure sections.
4. Validate referenced paths exist and are authoritative.
5. Run a final pass for duplicate rules, redundant phrasing, and non-actionable prose.

## Feedback Loop

Use this loop for substantial edits:

1. Draft.
2. Prune non-universal or duplicated guidance.
3. Validate links and section coverage (`WHY/WHAT/HOW`).
4. Re-read for concision and remove filler.
5. Finalize.

## Time and Drift Guidance

- Avoid date-based branching in core guidance.
- Prefer timeless current-state instructions.
- If legacy behavior must be retained, isolate it in an "Old patterns" subsection or external guide.

## Quality Checklist

- Does each line help in most sessions?
- Are `WHY`, `WHAT`, and `HOW` all present?
- Are lengthy specifics moved to task guides?
- Are references pointing to authoritative files instead of duplicated code?
- Is deterministic verification guidance present and clear?
- Is the file concise enough to avoid context bloat?

## Evaluation Scenarios

Use these manual evals when iterating on this skill:

1. Compress a verbose root `CLAUDE.md` into concise universal guidance while preserving intent.
2. Add/update a nested `CLAUDE.md` override without duplicating root-level rules.
3. Audit links and remove behavior-hotfix clutter while keeping task routing clear.

## Anti-Patterns

- Overlong command catalogs in root `CLAUDE.md`.
- Large style-guide sections that linters/formatters should enforce.
- Copying code examples likely to drift from source.
- Instructions that only apply to a rare, narrow workflow.
- Accumulating one-off behavior hotfixes in root onboarding context.
- Repeating system/developer-level global rules already enforced elsewhere.
- Adding rigid step checklists that are better suited to skill-level workflows.
