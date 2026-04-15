---
name: self-review-checklist
description: Perform a final self-review against this repo's CLAUDE guidance and Bricks core conventions before finishing work. Use before finalizing code, docs, config, or pull-request-ready changes in this repository.
---

Use this skill immediately before finalizing work.

## Workflow

1. Read `CLAUDE.md`.
2. Read `docs/agent-guides/core-conventions.md`.
3. Re-check any touched project-specific files or local conventions.
4. Confirm relevant task-specific skills were applied.
5. Confirm deterministic validation was run or explicitly justified.
6. Confirm the final response clearly states:
   - what changed
   - what was validated
   - any remaining caveats or follow-ups

## Self-review checklist

### Scope and conventions

- Changes follow the existing project pattern and do not introduce unnecessary abstractions.
- Naming stays consistent: camelCase for variables/functions, PascalCase for components/types, kebab-case for file names.
- Types stay explicit and avoid `any` unless there is a strong reason.
- Request and response contracts stay clear and predictable.
- Environment-driven values remain in env/config, not hardcoded in source.

### React and frontend review

- Avoid React `useEffect` unless it is clearly the best solution.
- Do not use effects to derive state that can be computed during render.
- Arrays/objects/functions passed to hooks are stable or memoized when needed.
- Components stay focused and composable.
- Missing-state UI is explicit and neutral.
- Styling uses Tailwind and does not add broad global CSS for page-specific behavior.
- If React component, hook, or rendering logic changed, review against `.claude/skills/react-best-practices/SKILL.md` too.
- If Next.js route, layout, page, metadata, App Router structure, or client/server boundary logic changed, review against `.claude/skills/next-best-practices/SKILL.md` too.


### Validation

Run the smallest relevant deterministic checks available for the work done.

Examples:

- formatting
- lint
- test
- build

If a check is not possible yet because the app is not scaffolded or tooling is not installed, say that explicitly.
