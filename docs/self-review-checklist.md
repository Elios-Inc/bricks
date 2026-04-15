# Starter Kit Self-Review Checklist

Use this before finalizing work in this repo.

## Read first

- `CLAUDE.md`
- `docs/core-conventions.md`
- any touched task-specific skill in `.claude/skills/`

## Verify

- The change follows the existing pattern.
- No unnecessary abstraction was introduced.
- Types remain explicit and readable.
- React `useEffect` was avoided unless clearly justified.
- React changes were checked against `.claude/skills/react-best-practices/SKILL.md`.
- Next.js route or App Router changes were checked against `.claude/skills/next-best-practices/SKILL.md`.
- Environment-driven config stays in env/config, not hardcoded.
- Tailwind usage stays local and predictable.
- Convex/Vercel deployment assumptions remain correct when touched.
- Convex code changes were checked against `.claude/skills/convex-best-practices/SKILL.md`.
- Final response states what changed and what was validated.
