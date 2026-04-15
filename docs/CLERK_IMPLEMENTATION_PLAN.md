# Clerk Authentication Implementation Plan

## Overview

Add Clerk authentication to the Bricks Next.js app so that all dashboard routes require sign-in. This project does **not** use Convex -- the backend will use DrizzleORM. Clerk is purely a Next.js-layer concern: middleware gates routes, server components read identity, and the Clerk user ID is the foreign key stored in Drizzle-managed tables.

## Current State Analysis

The bricks repo is a Next.js 16.1 + Tailwind v4 + shadcn/ui starter with:

- **No auth** -- no middleware, no providers, no sign-in page
- **No database** -- no DrizzleORM setup yet (out of scope for this plan)
- **No route groups** -- flat `app/` with `layout.tsx`, `page.tsx`, `globals.css`
- **No providers** -- root layout renders children directly, no `ThemeProvider` or `ClerkProvider`
- **Dark mode hardcoded** -- `<html className="dark">`, `next-themes` installed but unused
- **No Clerk account** -- the Clerk project for Bricks has not been created yet in the Clerk Dashboard

### Key Discoveries:
- `next-themes` is already in `package.json` but not wired up -- we can optionally add a theme-aware Clerk provider later
- The app uses Tailwind v4 (CSS-based config in `globals.css`, no `tailwind.config.ts`)
- shadcn/ui components are present in `components/ui/`
- Next.js 16 means `proxy.ts` is also a valid middleware filename, but we should use the standard `middleware.ts`

### Reference Implementation:
- centerpeak-university uses `@clerk/nextjs` v7 with the same Next.js 16 runtime
- Research document: `thoughts/research/2026-04-14-clerk-auth-implementation.md`

## Desired End State

After this plan is complete:

1. All routes except `/sign-in` and `/api` require authentication
2. Unauthenticated users are redirected to a `/sign-in` page
3. Authenticated users see the app with a `<UserButton>` for sign-out
4. Server components can call `currentUser()` or `auth()` to get the Clerk user ID
5. The Clerk user ID is available as a string that can later be used as a foreign key in Drizzle tables
6. `npm run build` succeeds with no type errors

### How to verify:
- `npm run build` passes
- `npm run lint` passes
- Visiting `/` while signed out redirects to `/sign-in`
- Signing in redirects back to `/`
- The `<UserButton>` renders in the header and allows sign-out

## What We're NOT Doing

- **Clerk Dashboard setup** -- the account doesn't exist yet; this plan documents what env vars are needed and where to get them
- **DrizzleORM integration** -- no database schema, migrations, or user table; that's a separate plan
- **Theme-aware Clerk provider** -- we'll use `ClerkProvider` without custom theme variables initially (dark mode is hardcoded); theming can be added later
- **Sign-up page** -- Bricks is an internal tool; sign-in only (matches centerpeak-university pattern)
- **MCP/OAuth tools** -- not needed for this app
- **Custom Clerk appearance overrides** -- ship with Clerk defaults first, style later

## Prerequisites (Manual Steps Before Implementation)

These steps must be completed by a human before the implementation phases can begin:

### 1. Create the Clerk Application

1. Go to [clerk.com/dashboard](https://clerk.com/dashboard) and sign in (or create an account)
2. Click **"Add application"**
3. Name it **"Bricks"** (or "Bricks - Development" for the dev instance)
4. Choose authentication methods:
   - **Email** (recommended minimum)
   - **Google OAuth** and/or **Microsoft OAuth** if needed for the team
5. Clerk creates a **Development** instance automatically

### 2. Copy the API Keys

From the Clerk Dashboard > **API Keys** page, copy:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` -- starts with `pk_test_...`
- `CLERK_SECRET_KEY` -- starts with `sk_test_...`

### 3. Create `.env.local`

Create `/home/matt/working/elios/bricks/.env.local` with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```

This file is gitignored and must exist locally before the app will work.

---

## Implementation Approach

The implementation follows the same pattern as centerpeak-university but simplified:

1. Install the package
2. Add middleware to protect routes
3. Wrap the app in `ClerkProvider`
4. Create the sign-in page with route group
5. Add `<UserButton>` to the existing header
6. Update `.env.example` to document required variables

Each phase is independently testable and builds on the previous one.

---

## Phase 1: Install `@clerk/nextjs` and Update `.env.example`

### Overview
Install the Clerk package and document the required environment variables.

### Changes Required:

#### 1. Install the dependency
```bash
npm install @clerk/nextjs
```

#### 2. Update `.env.example`
**File**: `.env.example`

Replace the current placeholder with:
```env
# Clerk authentication
# Get these from https://clerk.com/dashboard > API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```

### Success Criteria:
- [ ] `npm install` completes without errors
- [ ] `@clerk/nextjs` appears in `package.json` dependencies
- [ ] `.env.example` documents all 4 Clerk variables

---

## Phase 2: Add Clerk Middleware

### Overview
Create `middleware.ts` at the project root to protect all routes except the sign-in page and API endpoints.

### Changes Required:

#### 1. Create middleware
**File**: `middleware.ts` (project root)

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/api(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

This is the standard `@clerk/nextjs` v7 middleware pattern. `auth.protect()` redirects unauthenticated users to the Clerk sign-in URL (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`).

### Success Criteria:
- [ ] `middleware.ts` exists at project root
- [ ] `npm run build` passes (middleware compiles)
- [ ] `npm run lint` passes

---

## Phase 3: Wrap the App in `ClerkProvider`

### Overview
Add `ClerkProvider` to the root layout so all Clerk components and hooks work throughout the app.

### Changes Required:

#### 1. Update root layout
**File**: `app/layout.tsx`

Add `ClerkProvider` wrapping `{children}` in the `<body>`. Since dark mode is currently hardcoded via `className="dark"` and we're not adding theme-aware Clerk variables yet, a simple wrapper is sufficient:

```tsx
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // ... (unchanged)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${montserrat.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

Note: `ClerkProvider` wraps `<html>` -- this is the Clerk v7 recommended pattern for Next.js App Router. It works as a server component boundary.

### Success Criteria:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

---

## Phase 4: Create the Sign-In Page

### Overview
Add a sign-in page using Clerk's `<SignIn>` component at the catch-all route `/sign-in/[[...sign-in]]`, inside an `(auth)` route group to separate it from the main app layout.

### Changes Required:

#### 1. Create auth route group layout
**File**: `app/(auth)/layout.tsx`

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

A passthrough layout -- the sign-in page owns its own full-page layout.

#### 2. Create sign-in page
**File**: `app/(auth)/sign-in/[[...sign-in]]/page.tsx`

```tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignIn />
    </main>
  );
}
```

The `[[...sign-in]]` catch-all segment lets Clerk handle its own internal sub-paths (SSO callbacks, factor verification, etc.) under the `/sign-in` prefix.

### Success Criteria:
- [ ] `app/(auth)/sign-in/[[...sign-in]]/page.tsx` exists
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

---

## Phase 5: Add `<UserButton>` to the App Header

### Overview
Create a `UserMenu` component and add it to the existing home page header, giving users a way to see their avatar and sign out.

### Changes Required:

#### 1. Create user menu component
**File**: `components/user-menu.tsx`

```tsx
'use client';

import { UserButton } from '@clerk/nextjs';

export function UserMenu() {
  return <UserButton />;
}
```

Minimal wrapper -- Clerk's `<UserButton>` needs a client component boundary. Custom appearance overrides can be added later.

#### 2. Add to home page header
**File**: `app/page.tsx`

Add the `<UserMenu />` component to the existing `<header>` element, positioned at the right edge:

```tsx
import { UserMenu } from '@/components/user-menu';

// In the header:
<header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
  <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
    <Image
      src="/logo.png"
      alt="Bricks"
      width={120}
      height={40}
      className=""
      priority
    />
    <div className="ml-auto">
      <UserMenu />
    </div>
  </div>
</header>
```

### Success Criteria:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

---

## Phase 6: Create `(app)` Route Group (Optional, Recommended)

### Overview
Move the home page into an `(app)` route group to separate authenticated app routes from the `(auth)` group. This establishes the convention for all future authenticated pages.

### Changes Required:

#### 1. Create app route group layout
**File**: `app/(app)/layout.tsx`

```tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

#### 2. Move home page
Move `app/page.tsx` to `app/(app)/page.tsx`. No code changes needed -- the route still serves at `/`.

### Success Criteria:
- [ ] `app/(app)/page.tsx` serves the home page at `/`
- [ ] `app/(auth)/sign-in/[[...sign-in]]/page.tsx` still works
- [ ] `npm run build` passes

---

## Testing Strategy

### Manual Testing (after Clerk account is created):
- Visit `/` while signed out -- should redirect to `/sign-in`
- Sign in via Clerk -- should redirect back to `/`
- `<UserButton>` should render in the header showing the user's avatar
- Click the user button -- sign-out option should appear
- Sign out -- should redirect to `/sign-in`

### Automated Checks:
- `npm run build` -- verifies all routes compile and `ClerkProvider` / middleware are wired up
- `npm run lint` -- catches import and type issues

### Server-Side Auth Verification:
Once auth is working, test that server components can access the user:

```tsx
import { currentUser } from '@clerk/nextjs/server';

// In any server component:
const user = await currentUser();
console.log(user?.id); // Clerk user ID string
```

This user ID will later be the foreign key in Drizzle tables.

---

## Future Considerations (Out of Scope)

These are not part of this plan but are natural next steps:

1. **DrizzleORM user table** -- store `clerkUserId` as a column, sync on first sign-in or via webhook
2. **Clerk webhook for user sync** -- `POST /api/webhooks/clerk` to create/update Drizzle user rows when Clerk users are created/updated
3. **Theme-aware ClerkProvider** -- once `next-themes` is wired up, add a `ThemedClerkProvider` (see centerpeak-university's `components/themed-clerk-provider.tsx` for the pattern)
4. **Custom sign-in appearance** -- style the `<SignIn>` component to match the Bricks brand
5. **Role-based access** -- use Clerk's `publicMetadata` or `organizationMemberships` for admin/viewer roles
6. **Production Clerk instance** -- create a separate Production instance in Clerk Dashboard with production API keys for Vercel deployment

## References

- centerpeak-university Clerk implementation: `../centerpeak-university/` (sibling repo)
- Research document: `thoughts/research/2026-04-14-clerk-auth-implementation.md`
- Clerk Next.js quickstart: https://clerk.com/docs/quickstarts/nextjs
- `@clerk/nextjs` v7 middleware docs: https://clerk.com/docs/references/nextjs/clerk-middleware
