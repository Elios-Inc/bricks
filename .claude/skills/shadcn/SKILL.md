---
name: shadcn
description: Work with shadcn/ui patterns and components in this repo. Use when adding, refining, or reviewing shadcn-style UI primitives, component composition, or design-system building blocks.
---

Use this skill only when the task actually involves shadcn/ui or shadcn-style component patterns.

## Role in this repo

This skill complements, not replaces:
- `react-best-practices` for React and Next.js implementation choices

## Use it for

- shadcn/ui component setup
- shadcn-style primitive composition
- button, dialog, form, popover, sheet, and similar UI building blocks
- reviewing whether shared primitives should be extracted

## Ground rules

- Do not introduce shadcn/ui just because it exists.
- Use it when the repo has adopted it or the task explicitly calls for it.
- Keep components aligned with repo conventions in `CLAUDE.md` and `docs/core-conventions.md`.
- Avoid over-abstracting too early.
- Prefer local consistency over blindly following generic examples.

## Review questions

- Does this component belong as a reusable primitive?
- Is the API simpler than the raw duplicated markup it replaces?
- Is the styling consistent with the rest of the repo?
- Is this introducing a dependency or abstraction too early?
