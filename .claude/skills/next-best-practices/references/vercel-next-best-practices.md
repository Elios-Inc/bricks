# Vercel Next best practices notes

Source:
- https://skills.sh/vercel-labs/next-skills/next-best-practices

Use this as supplemental guidance for Next.js-specific implementation and review.

## Focus areas

- App Router conventions
- Server Component first thinking
- tight `use client` boundaries
- server-side data fetching when possible
- avoiding waterfalls
- route structure, metadata, and rendering behavior

## How to use in this starter kit

- Default to server-rendered route logic.
- Keep interactive islands small.
- Do not move broad page trees into the client without a reason.
- Keep metadata and route files aligned with Next.js conventions.
- Combine this with `react-best-practices` when reviewing performance or hook usage.
