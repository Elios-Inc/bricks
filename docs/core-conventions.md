# Core Conventions

Trimmed from the Elios Insights conventions for a starter-kit repo.

## Naming and types

- Never typecast unless there is no cleaner option.
- Use camelCase for variables/functions, PascalCase for components/types, kebab-case for file names.
- Avoid `any`.
- Prefer shared or derived types over duplicated inline types.
- Use `type Props = {}` for component props.

## Imports and modules

- Prefer consistent local import conventions once the app is scaffolded.
- Keep server-only and client-only code clearly separated.
- Avoid creating abstractions before there is a repeated pattern.

## API and request patterns

- Keep request and response types explicit.
- Do not hardcode API URLs.
- Use environment variables for runtime configuration.
- Keep data contracts simple and predictable.

## Utilities and safety

- Prefer existing validation or utility libraries before writing custom regex or helpers.
- Use environment helpers or safe access patterns for secrets.
- Do not expose secret values in source, logs, or client bundles.

## React and hooks

- Avoid React `useEffect` unless it is clearly the best solution.
- Do not use effects to derive state that can be computed during render.
- Memoize unstable arrays/objects/functions when they feed hooks.
- Keep components focused and readable.

## UI and copy

- Prefer explicit, neutral copy for missing data.
- Render punctuation and separators conditionally.
- Extract shared formatting logic only when it is truly reused.

## Styling

- Prefer Tailwind utilities.
- Keep spacing on a consistent scale.
- Avoid page-specific rules in broad global CSS.

## Deployments

- Keep Vercel and Convex configuration environment-driven.
- Use preview and production deploy keys in the correct environment scopes.
- Re-check authentication allowed URLs when changing domains or deployment setup.
