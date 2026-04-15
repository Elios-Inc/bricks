---
name: web-design-guidelines
description: Review frontend files for web design quality and compliance using the latest Vercel web interface guidelines. Use after building or editing UI when auditing pages, components, or styling for quality, consistency, and design issues.
---

Use this as a **review skill**, not the primary design/build skill.

Build with `frontend-design`.
Review with this skill.

## Workflow

1. Fetch the latest guidelines from:

```text
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

2. Read the target files.
3. Check them against the fetched rules.
4. Output findings tersely with file and line references.

## When to use

Use this after meaningful frontend work such as:

- page design
- component design
- layout changes
- styling refactors
- UI polish passes

## Output style

Keep findings short and actionable.

Prefer:

- `path/to/file.tsx:123` concise finding
- grouped issues only when that makes review clearer

## Notes

- This skill is for **auditing** frontend work.
- It does not replace repo-specific build guidance in `frontend-design`.
- Apply repo conventions too:
  - `CLAUDE.md`
  - `docs/core-conventions.md`
