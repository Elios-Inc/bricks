---
name: react-best-practices
description: Apply modern React and Next.js best practices in the Bricks dashboard. Use when building or reviewing React components, App Router pages, data fetching, performance-sensitive code, hook usage, client/server boundaries, or when deciding whether `useEffect` is actually necessary.
---

Use this for React and Next.js work in this repo.

Keep fixes ordered by impact. Do not start with micro-optimizations.

## First priorities

Check these first before touching low-impact details:

1. eliminate waterfalls
2. reduce client bundle size
3. avoid unnecessary client components
4. avoid unnecessary React effects
5. reduce avoidable re-renders

## Default rule

Avoid React `useEffect` unless it is clearly the best solution.

Prefer, in order:

- derive during render
- server data fetching
- event handlers
- lazy initialization
- memoization for stable inputs
- framework primitives already provided by Next.js or React

Especially avoid:

- `useEffect(() => setState(...), [deps])` for derived state
- fetch-in-effect when the work can happen on the server
- chains of effects that create sequencing or synchronization bugs

## Ordering matters

If there is a request waterfall or oversized client bundle, fix that before polishing memoization or render trivia.

Examples of higher-impact fixes:

- parallelize independent async work
- move data fetching to the server when possible
- keep heavy libraries out of the client bundle
- avoid making a whole subtree client-side when only a small interactive part needs it

## React and Next.js guidance

### Data fetching

- Prefer server-side fetching in App Router when possible.
- Avoid client fetch waterfalls.
- If multiple async calls are independent, run them in parallel.
- Do not wait on work before branching if the result is only needed in one branch.

### Client and server boundaries

- Default to Server Components unless interactivity requires a Client Component.
- Keep Client Components small.
- Do not push large static UI trees behind `use client` without a reason.

### State and effects

- Derive state during render when possible.
- Use lazy state initialization for expensive one-time work.
- Memoize only when it actually protects expensive recomputation or stabilizes hook inputs.
- Do not use effects as a generic synchronization hammer.

### Rendering and bundles

- Avoid importing heavy client-only dependencies at the top of broad shared modules.
- Keep page-level components focused.
- Extract repeated UI only after a real pattern appears.
- Optimize for clarity first, then performance, but fix obvious high-impact performance issues early.

## Review checklist

Before finishing React work, ask:

- Is there an async waterfall?
- Did this introduce unnecessary client-side code?
- Did I use `useEffect` where render logic, server fetching, or an event handler would be cleaner?
- Did I make a component client-side that could stay on the server?
- Did I add memoization that is unnecessary or hard to justify?
- Is this a real performance improvement or just code churn?

## References

Read only if needed:

- `references/vercel-react-best-practices.md`
