# nextjs-convex-starter-kit

A starter kit for quickly building **Next.js + Convex** apps with **Tailwind** and deploying them to **Vercel**.

This repo is meant to help Elios move fast on:
- proofs of concept
- MVPs
- internal tools
- new product ideas
- client demos

It is optimized for getting a real full-stack app off the ground quickly, while still being clean enough to scale if the project proves itself.

## What this starter kit includes

- **Next.js** with the App Router
- **Convex** for backend functions, data, and realtime patterns
- **Tailwind CSS** for styling
- **Vercel-friendly** deployment setup
- local `.claude/skills` and repo conventions for AI-assisted development

## What this starter kit is for

Use this when you want to:
- start a new web product quickly
- validate an idea without setting up everything from scratch
- build with modern React and Next.js patterns
- use Convex as the backend from day one
- keep the project ready for Claude Code and other coding-agent workflows

This is not meant to be a huge enterprise boilerplate.
It should stay simple, understandable, and easy to extend.

## Quick start

### 1) Install dependencies

```bash
npm install
```

### 2) Set up environment variables

Copy the example env file and fill in the values you need.

```bash
cp .env.example .env.local
```

Depending on your setup, you may also need Convex and Vercel environment variables later.

### 3) Run the app locally

```bash
npm run dev
```

This starts:
- the Next.js frontend
- the Convex dev process

### 4) Open the app

By default, open:

```text
http://localhost:3000
```

## Available scripts

### Run locally

```bash
npm run dev
```

Runs the frontend and Convex backend together.

### Build

```bash
npm run build
```

Builds the Next.js app for production.

### Start production server locally

```bash
npm run start
```

Runs the built Next.js app.

### Lint

```bash
npm run lint
```

Runs ESLint, including the Convex ESLint plugin rules already included in this repo.

### Test

There is **not a test runner configured yet** in this starter template.

That means there is currently no `npm test` script.

Recommended next step when a project needs tests:
- add **Vitest** for unit/integration tests
- add **Playwright** for end-to-end tests
- then wire a `test` script into `package.json`

## Convex notes

This repo already includes a Convex starter structure.

For Convex-specific implementation guidance, use the local Claude skills in:

```text
.claude/skills/
```

Especially:
- `convex`
- `convex-best-practices`
- `convex-vercel-deploy`

## Deployment

This starter kit is designed for **Vercel** deployment with **Convex**.

The recommended production deployment flow is documented in the local skill:

```text
.claude/skills/convex-vercel-deploy/SKILL.md
```

At a high level, deployment usually means:
- create a Vercel project
- set the build command to run Convex deploy before the frontend build
- add `CONVEX_DEPLOY_KEY` in the correct Vercel environment
- deploy to production or preview as needed

### Deployment logistics to remember

For local development:
- log in with Convex CLI using Vercel
- connect the repo to a real Convex project
- get the real `NEXT_PUBLIC_CONVEX_URL`
- local development does **not** need `CONVEX_DEPLOY_KEY`

For Vercel deployment:
- connect the Convex project to the Vercel project
- store `CONVEX_DEPLOY_KEY` in **Vercel environment variables**, not GitHub secrets
- scope it to **Production** and **Preview** as needed
- use the Convex deploy-aware build command when deployment is configured
- during `npx convex deploy --cmd 'npm run build'`, Convex will usually infer and set the frontend Convex URL for Next.js builds
- if that inference ever fails, use `--cmd-url-env-var-name`

For GitHub Actions:
- current CI only needs lint and build
- GitHub does **not** need `CONVEX_DEPLOY_KEY` unless you later choose GitHub-driven deployments

## AI-assisted development

This repo includes local conventions and skills for Claude Code usage.

Important files:
- `CLAUDE.md`
- `docs/core-conventions.md`
- `.claude/skills/`

These help keep work consistent around:
- React best practices
- Next.js best practices
- Convex best practices
- frontend design
- self-review
- pull requests and commits

## Auth

This starter kit intentionally starts with **no authentication installed**.

That is deliberate.

It keeps the base scaffold simpler for early product work, POCs, and MVPs.

When you are ready to add auth, use the local skill:

```text
.claude/skills/convex-setup-auth/SKILL.md
```

Use that as the recommended starting point for choosing a provider and wiring auth correctly.

## Scaling note

This starter kit is intentionally lightweight.

That is a feature, not a bug.

You should be able to start small and then add structure only when the project actually needs it:
- shared UI primitives
- test runners
- auth
- analytics
- design system layers
- stricter CI/CD

## Client transfer and deployment setup

If this starter kit is being turned into a real client project, use this sequence.

### 1. Set up client-owned GitHub

The client should:
- create their own GitHub account or organization setup
- create a **private** repository for the project
- give temporary access to the Elios developers who need to bootstrap the app

If the project did not begin directly in their repo, copy or push the code into their private GitHub repository before deployment setup.

### 2. Set up client-owned Vercel

The client should:
- create a Vercel team/account for the project
- configure billing access
- add any internal developers or IT owners who should retain access
- temporarily add Elios developers who are helping with setup

### 3. Create the Vercel project

In Vercel:
- create a project for the app
- connect the client-owned GitHub repository
- set deployment protection or password protection if phase 1 requires restricted access

### 4. Install Convex through the Vercel Marketplace

Install Convex from:

```text
https://vercel.com/marketplace/convex
```

Install it into the Vercel project created above.

This is the standard path for wiring Convex deployment into Vercel.

### 5. Configure Vercel deployment settings

In Vercel:
- make sure the environments you need are enabled
  - **Production**
  - **Preview** if you want preview deployments
- keep the **Custom Prefix** field empty if Convex requires that for deployment integration
- set the build command to:

```bash
npx convex deploy --cmd 'npm run build'
```

### 6. Configure deployment environment variables

In Vercel:
- add `CONVEX_DEPLOY_KEY`
- scope it appropriately for:
  - **Production**
  - **Preview** if used

`CONVEX_DEPLOY_KEY` belongs in **Vercel**, not GitHub Actions, for the standard Convex + Vercel deployment setup.

### 7. Connect the local repo through the Convex CLI

On a developer machine:

```bash
npx convex login --vercel
npx convex dev
```

Then:
- choose the existing Convex project associated with the Vercel setup
- let Convex write the local project connection details
- get the real local `NEXT_PUBLIC_CONVEX_URL`

That local public URL belongs in `.env.local` for development.

### 8. Understand the frontend URL behavior

For local development:
- you use the real `NEXT_PUBLIC_CONVEX_URL`

For Vercel deployment:
- `npx convex deploy --cmd 'npm run build'` will usually infer and set the frontend Convex URL during the build
- if that inference fails, use:

```bash
npx convex deploy --cmd 'npm run build' --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL
```

### 9. GitHub Actions scope

Current CI in this starter kit is only for:
- lint
- build

GitHub Actions does **not** need `CONVEX_DEPLOY_KEY` unless you later choose GitHub-driven deployments instead of the standard Vercel path.

## Recommended workflow

1. clone the repo
2. install dependencies
3. configure env vars
4. run locally
5. build the first real feature
6. add tests once the product shape starts to settle
7. deploy to Vercel with Convex

## License / attribution

This repo started from the Convex Vercel template and has been adapted into an Elios-oriented starter kit for fast product work.
