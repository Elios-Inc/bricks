---
name: next-best-practices
description: Apply modern Next.js App Router best practices in the Bricks dashboard. Use when creating or reviewing routes, layouts, server and client component boundaries, metadata, data fetching, caching, or other Next.js-specific implementation decisions.
---

Use this for Next.js-specific work in this repo.

This repo uses a modern Next.js App Router scaffold.

## First priorities

Check these first before lower-level tweaks:

1. keep Server Components as the default
2. keep `use client` boundaries as small as possible
3. fetch data on the server when possible
4. avoid client-side waterfalls
5. keep route structure and metadata clean

## Core rules

- Prefer Server Components unless interactivity requires a Client Component.
- Do not add `use client` higher in the tree than necessary.
- Keep layouts, pages, and shared wrappers simple.
- Use framework conventions instead of inventing parallel app structure.
- Avoid React `useEffect` unless it is clearly the best solution.

## Data and rendering

- Prefer server-side data fetching in App Router when possible.
- Run independent async work in parallel.
- Avoid fetch-in-effect when the server can do the work.
- Watch for waterfalls across layouts, pages, and child components.

## Route and file conventions

- Follow App Router naming and placement conventions.
- Keep page, layout, loading, and error boundaries intentional.
- Add or preserve page metadata when building real pages.
- Keep route-level logic close to the route unless reuse is real.

## Client/server boundary review

Before finishing, ask:

- Could this stay a Server Component?
- Is `use client` only applied where needed?
- Did I move unnecessary logic into the client?
- Is this using Next.js conventions instead of fighting them?

## References

Read only if needed:

- `references/vercel-next-best-practices.md`
