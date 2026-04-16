# Bricks Agent Guide

## Why

This repository is the Bricks social media dashboard, built with Next.js + Tailwind and intended for Vercel deployment.

Keep guidance concise, broadly applicable, and reusable across most sessions.

## What

- Next.js App Router frontend
- Tailwind-based styling
- Vercel-oriented deployment flow
- Local project skills in `.claude/skills/`
- Trimmed engineering guidance in `docs/core-conventions.md`

## How

- Never delete, revert, or overwrite untracked files or uncommitted changes you did not create.
- Prefer existing project patterns before introducing new abstractions.
- Keep changes scoped and validate with the smallest useful command set first.
- Use `npm`, not `pnpm`, `bun`, or `yarn`.
- Keep request/response typing explicit end to end.
- Do not hardcode deployment URLs or secrets.
- Use environment variables for Vercel configuration.
- Use camelCase for variables/functions, PascalCase for components/types, and kebab-case for file names.
- Avoid `any`.
- Prefer `type Props = { ... }` for component props.
- Follow existing Next.js App Router conventions.
- Keep components small and composable.
- Avoid React `useEffect` unless it is actually the best solution.
- Especially avoid `useEffect(() => setState(...), [deps])` when state can be derived during render.
- Treat arrays, objects, and functions passed to hooks as unstable unless memoized.
- Use Tailwind utility classes and avoid broad global CSS changes for page-specific styling.
## Progressive Disclosure

Read more only when needed:

- `docs/core-conventions.md` for trimmed engineering conventions
- `.claude/skills/self-review-checklist/SKILL.md` before finalizing work
- `.claude/skills/claude-md-authoring/SKILL.md` when creating or editing `CLAUDE.md`

## Validation

Before finalizing work, run the most relevant checks available for the files you changed.

If the app is scaffolded and tooling is available, prefer validating with lint, test, and build where practical.
