---
name: convex-vercel-deploy
description: Deploy Convex apps on Vercel. Use when setting up or verifying Convex production hosting on Vercel, configuring the Vercel build command, adding CONVEX_DEPLOY_KEY, wiring frontend Convex URL env injection, setting up preview deployments, or checking auth/custom-domain implications for Convex on Vercel.
---

# Convex + Vercel deploy

Use this for Convex apps hosted on Vercel.

Keep the flow short and operational.

## Core production setup

1. Confirm the app already works with Convex locally.
2. Create or open the Vercel project.
3. Set the Vercel build command to:

```bash
npx convex deploy --cmd 'npm run build'
```

4. In the Convex dashboard, generate a **Production Deploy Key** for the production deployment.
5. In Vercel, add:

```bash
CONVEX_DEPLOY_KEY=<production deploy key>
```

6. Scope that variable to **Production** only.
7. Deploy.

## What this does

`npx convex deploy` will:

- read `CONVEX_DEPLOY_KEY`
- target the Convex production deployment
- set `CONVEX_URL` or the inferred frontend env var during build
- deploy Convex functions
- run the frontend build with the production Convex URL

## Custom frontend env var name

If Convex cannot infer the frontend URL env var name, use:

```bash
npx convex deploy --cmd-url-env-var-name CUSTOM_CONVEX_URL --cmd 'npm run build'
```

Only do this when the app expects a non-standard Convex URL variable.

## Preview deployments

For Vercel preview deployments:

1. Generate a **Preview Deploy Key** in Convex.
2. Add `CONVEX_DEPLOY_KEY` in Vercel for the **Preview** environment only.
3. Keep the same deploy command, optionally with preview seed/setup:

```bash
npx convex deploy --cmd 'npm run build' --preview-run 'functionName'
```

Use `--preview-run` only if fresh preview backends need seed/setup data.

## Authentication and domains

- Re-check auth provider allowed URLs for the deployed domain.
- If using Clerk, expect to need a custom domain instead of the default `*.vercel.app` preview/production hostname.
- If Convex functions are served through a custom domain, read the Convex custom-domain docs too.

## Vercel-specific checks

- If the app lives in a subdirectory, set the Vercel **Root Directory** correctly.
- Confirm the build command is overridden in Vercel and not still using the framework default.
- Confirm `CONVEX_DEPLOY_KEY` is scoped to the correct environment.
- Confirm the deployed frontend points at the intended Convex deployment.

## Good final verification

After setup or changes, verify:

- Vercel build succeeds
- Convex functions deploy successfully
- frontend can talk to Convex in production
- auth callbacks/allowed origins still work
- preview deployments create isolated Convex backends when enabled

## References

Read this only if you need more detail:

- `references/vercel-preview-notes.md` for preview deployment behavior and setup caveats
- Convex docs source page: `https://docs.convex.dev/production/hosting/vercel`
