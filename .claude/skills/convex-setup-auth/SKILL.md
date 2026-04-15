---
name: convex-setup-auth
description: Set up authentication for Convex apps in this repo. Use when adding auth for the first time, choosing an auth provider, wiring provider-specific setup, protecting Convex functions, or configuring user identity and access control.
---

Use this skill when the starter kit is ready to add authentication.

This starter kit does **not** begin with auth already installed.

## First step

Choose the auth provider before writing setup code.

Do not assume a provider.

Look for repo signals first. If none exist, ask the user.

Common options:

- Convex Auth
- Clerk
- WorkOS AuthKit
- Auth0
- custom JWT provider

## What this skill covers

- choosing an auth provider
- provider setup and wiring
- Convex auth integration
- protecting backend functions with `ctx.auth.getUserIdentity()`
- user identity mapping and access control
- local-only vs production-ready auth setup

## Ground rules

- Do not add auth by default just because most apps need it.
- Ask whether the user wants local-only setup or production-ready setup.
- Follow official provider docs for provider-specific setup.
- Follow official Convex docs for shared auth behavior.
- Only add app-level user storage if the app actually needs it.
- Do not trust client-provided user identity values when the backend can verify identity.

## References

Read only if needed:

- `references/convex-auth-setup-notes.md`
