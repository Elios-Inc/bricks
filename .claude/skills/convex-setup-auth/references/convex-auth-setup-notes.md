# Convex auth setup notes

Source:
- https://skills.sh/get-convex/agent-skills/convex-setup-auth
- https://docs.convex.dev/auth
- https://docs.convex.dev/auth/functions-auth
- https://docs.convex.dev/auth/database-auth

## Key reminder

This starter kit intentionally starts with **no auth**.

That is by design.

When auth is needed:
- choose the provider deliberately
- wire it cleanly
- protect Convex functions on the server
- only add app-level user records if the product actually needs them
