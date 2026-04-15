---
name: frontend-design
description: Design and build polished frontend pages and components for the Bricks dashboard. Use when creating or refining UI in the App Router app, styling with Tailwind, improving visual hierarchy, or making the app feel intentional instead of generic.
---

Build frontend UI that feels deliberate, clean, and production-ready.

This repo starts from a minimal Next.js + Tailwind template, so treat the current scaffold as a foundation, not a finished design system.

## First read

Before making meaningful frontend changes, read:

- `CLAUDE.md`
- `docs/core-conventions.md`
- `app/globals.css`

## Ground rules

- Use Tailwind classes as the default styling mechanism.
- Follow Next.js App Router patterns already present in the repo.
- Avoid React `useEffect` unless it is clearly the best solution.
- Keep components small and composable.
- Do not hardcode environment-specific values in UI code.
- Avoid broad global CSS changes unless the task is clearly design-system level.

## Design approach for Bricks

The imported template is intentionally minimal. Improve it without turning every task into a redesign.

When adding or refining UI:

1. Pick a clear visual direction.
2. Stay consistent within that direction.
3. Prefer composition, spacing, typography, and hierarchy over random decorative noise.
4. Introduce new tokens or global styles only when they will actually be reused.

## Tailwind and theme guidance

- Prefer Tailwind utilities first.
- Reuse existing CSS variables from `app/globals.css` before adding new ones.
- If a new token is genuinely needed, add it cleanly to the existing `:root` / `@theme` setup.
- Keep light/dark behavior coherent with the existing template.
- Avoid one-off hex color spam in component markup when a reusable variable or class pattern would be better.

## Imports and components

- Prefer local project patterns over importing new UI libraries.
- Do not add a component library unless explicitly requested.
- Avoid creating abstractions too early.
- If a visual pattern repeats, then extract a reusable component.

## What good looks like

Aim for UI that is:

- visually intentional
- easy to scan
- strong in spacing and typography
- not generic AI demo sludge
- still simple enough to extend

## Default review checklist

Before finishing frontend work, check:

- Does the UI feel intentional instead of default?
- Does it preserve or improve readability?
- Are styles mostly local and predictable?
- Did you avoid unnecessary `useEffect`?
- Did you avoid adding a heavy abstraction too early?
- If you changed global styles, was that actually justified?

## When to push further

Push the design harder only when the user asks for a more opinionated or showcase-quality interface.

Otherwise, optimize for:

- clean base patterns
- tasteful defaults
- a solid foundation for later iteration
