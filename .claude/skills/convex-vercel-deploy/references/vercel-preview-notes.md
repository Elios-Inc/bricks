# Convex preview deployments on Vercel

Use this only when the task involves preview deployments.

## Preview behavior

- Convex can create a fresh backend per Vercel preview deployment.
- Preview deployments stay isolated from production and development.
- Each preview backend gets its own functions, data, crons, and config.

## Required setup

- Generate a **Preview Deploy Key** in Convex.
- Add `CONVEX_DEPLOY_KEY` in Vercel.
- Scope it to **Preview** only.

## Optional setup data

If a preview backend needs initial data, add:

```bash
npx convex deploy --cmd 'npm run build' --preview-run 'functionName'
```

That function only runs for preview deployments.

## Notes

- Convex will infer the branch name for Vercel preview deployments.
- If needed, `--preview-create` can customize the preview deployment name.
- If the app depends on Convex environment variables, consider project-level defaults for preview/dev deployments.
