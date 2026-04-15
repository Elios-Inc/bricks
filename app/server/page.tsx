import Image from "next/image";

import { preloadQuery, preloadedQueryResult } from "convex/nextjs";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import Home from "./inner";

const hasConvexUrl = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

function ConvexSetupNotice() {
  return (
    <Card>
      <CardHeader>
        <Badge variant="secondary">Server example</Badge>
        <CardTitle>Convex is not configured yet</CardTitle>
        <CardDescription>
          This page stays build-safe until you add a real Convex deployment URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Add <code className="font-mono">NEXT_PUBLIC_CONVEX_URL</code> and the
          server example will start preloading live Convex data.
        </p>
      </CardContent>
    </Card>
  );
}

export default async function ServerPage() {
  let data: unknown = null;
  let preloaded: Awaited<
    ReturnType<typeof preloadQuery<typeof api.myFunctions.listNumbers>>
  > | null = null;

  if (hasConvexUrl) {
    preloaded = await preloadQuery(api.myFunctions.listNumbers, {
      count: 3,
    });
    data = preloadedQueryResult(preloaded);
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-8">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <Image src="/convex.svg" alt="Convex Logo" width={48} height={48} />
          <div className="h-12 w-px bg-border"></div>
          <Image
            src="/nextjs-icon-light-background.svg"
            alt="Next.js Logo"
            width={48}
            height={48}
            className="dark:hidden"
          />
          <Image
            src="/nextjs-icon-dark-background.svg"
            alt="Next.js Logo"
            width={48}
            height={48}
            className="hidden dark:block"
          />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Convex + Vercel</h1>
      </div>

      {hasConvexUrl ? (
        <>
          <Card>
            <CardHeader>
              <Badge>Server preloading</Badge>
              <CardTitle>Non-reactive server-loaded data</CardTitle>
              <CardDescription>
                This shows the server-side preload path for Convex in App Router.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="block overflow-x-auto rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm text-muted-foreground">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </code>
            </CardContent>
          </Card>
          {preloaded ? <Home preloaded={preloaded} /> : null}
        </>
      ) : (
        <ConvexSetupNotice />
      )}
    </main>
  );
}
