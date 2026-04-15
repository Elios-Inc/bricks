"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { SparklesIcon, ShieldCheckIcon, RocketIcon } from "lucide-react";

import { api } from "../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const hasConvexUrl = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

const authCommands = {
  authkit: "npm create convex@latest -- --template nextjs-authkit",
  clerk: "npm create convex@latest -- --template nextjs-clerk",
  convexauth: "npm create convex@latest -- --template nextjs-convexauth",
} as const;

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/convex.svg" alt="Convex Logo" width={32} height={32} />
            <Separator orientation="vertical" className="h-8" />
            <Image
              src="/vercel-icon-light.svg"
              alt="Vercel Logo"
              width={32}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/vercel-icon-dark.svg"
              alt="Vercel Logo"
              width={32}
              height={32}
              className="hidden dark:block"
            />
            <div className="ml-1">
              <p className="font-semibold text-foreground">Next.js Convex Starter Kit</p>
              <p className="text-sm text-muted-foreground">Fast POCs, MVPs, and real product starts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" render={<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fget-convex%2Fvercel-marketplace-convex&project-name=vercel-with-convex&repository-name=vercel-with-convex&demo-title=Convex%20with%20Vercel&demo-description=A%20minimal%20template%20showcasing%20using%20Convex%20with%20Vercel&demo-url=https%3A%2F%2Fconvex-vercel-template-demo.previews.convex.dev%2F&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22convex%22%2C%22productSlug%22%3A%22convex%22%2C%22protocol%22%3A%22storage%22%7D%5D" />}>
              Clone to Vercel
            </Button>
            <AuthSetupSheet />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <HeroSection />
        {hasConvexUrl ? <ConfiguredContent /> : <SetupContent />}
      </main>
    </>
  );
}

function HeroSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Next.js</Badge>
          <Badge variant="secondary">Convex</Badge>
          <Badge variant="outline">Tailwind v4</Badge>
          <Badge variant="outline">Vercel-ready</Badge>
        </div>
        <CardTitle>Start fast without painting yourself into a corner</CardTitle>
        <CardDescription>
          This starter kit is designed to help you ship quickly with a clean
          baseline for React, Next.js, Convex, and Claude-assisted development.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<RocketIcon className="size-4" />}
            title="Built for speed"
            description="Use it for POCs, MVPs, internal tools, and new product ideas without starting from zero."
          />
          <FeatureCard
            icon={<SparklesIcon className="size-4" />}
            title="AI-native workflow"
            description="Local skills, conventions, and review checklists are already baked into the repo."
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="size-4" />}
            title="Ready to grow"
            description="Start simple, then add auth, testing, design-system depth, and deployment polish when the app earns it."
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 text-card-foreground">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SetupContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Starter state</Badge>
          <CardTitle>Convex is not configured yet</CardTitle>
          <CardDescription>
            That is intentional. This starter kit should lint, build, and give
            you a clean UI before you have a real Convex project.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-xl border border-dashed p-4">
            <p className="text-sm font-medium text-foreground">Missing environment variable</p>
            <code className="mt-2 inline-block rounded-md bg-muted px-3 py-2 font-mono text-sm text-muted-foreground">
              NEXT_PUBLIC_CONVEX_URL
            </code>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MiniStep title="1. Create a Convex project" description="Provision your backend when you are ready." />
            <MiniStep title="2. Add env vars" description="Populate .env.local and CI secrets with the real URL later." />
            <MiniStep title="3. Start building" description="You can still work on UI, routes, and app structure now." />
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Add auth later with <code className="font-mono">convex-setup-auth</code>.
          </p>
          <Button variant="outline" render={<Link href="/server" />}>View server example</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Where to go next</CardTitle>
          <CardDescription>
            The repo already includes the skills and conventions to help the next
            steps stay clean.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="build" className="w-full">
            <TabsList>
              <TabsTrigger value="build">Build</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>
            <TabsContent value="build" className="pt-4">
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Use the React and Next skills when shaping pages and components.</li>
                <li>Use the frontend design skill to keep UI intentional and reusable.</li>
                <li>Keep Server Components as the default.</li>
              </ul>
            </TabsContent>
            <TabsContent value="auth" className="pt-4">
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>The starter kit intentionally begins with no auth.</li>
                <li>Use <code className="font-mono">.claude/skills/convex-setup-auth/SKILL.md</code> when ready.</li>
                <li>Choose a provider deliberately instead of defaulting too early.</li>
              </ul>
            </TabsContent>
            <TabsContent value="deploy" className="pt-4">
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Deploy with Vercel once a real Convex project exists.</li>
                <li>Use <code className="font-mono">convex-vercel-deploy</code> for the actual workflow.</li>
                <li>The starter kit CI already checks lint and build on GitHub Actions.</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function MiniStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-4">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ConfiguredContent() {
  const data = useQuery(api.myFunctions.listNumbers, { count: 10 });
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading your Convex data</CardTitle>
          <CardDescription>
            The starter kit is connected. Waiting on the first query response.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-2 animate-bounce rounded-full bg-primary"></div>
            <div className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:0.1s]"></div>
            <div className="size-2 animate-bounce rounded-full bg-primary/50 [animation-delay:0.2s]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { numbers, viewer } = data;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <Badge>Convex connected</Badge>
          <CardTitle>Realtime number generator</CardTitle>
          <CardDescription>
            This starter demo proves the app is talking to Convex and can sync
            data reactively.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => void addNumber({ value: Math.floor(Math.random() * 10) })}>
            Generate random number
          </Button>
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">Newest numbers</p>
            <p className="font-mono text-lg text-foreground">
              {numbers.length === 0 ? "Generate a number to get started." : numbers.join(", ")}
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {viewer ? `Signed in as ${viewer}.` : "Auth is not configured in this starter kit by default."}
          </p>
          <Button variant="outline" render={<Link href="/server" />}>Server example</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Starter kit defaults</CardTitle>
          <CardDescription>
            These are the main paths to customize once your real app begins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border p-4">
            <p className="font-medium text-foreground">Backend</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Edit <code className="font-mono">convex/myFunctions.ts</code> to start shaping the backend.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="font-medium text-foreground">Frontend</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Edit <code className="font-mono">app/page.tsx</code> and the components under <code className="font-mono">components/ui</code> to shape the UI.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="font-medium text-foreground">Theme</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Swap semantic tokens in <code className="font-mono">app/globals.css</code> and the app should restyle without rewriting component markup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuthSetupSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="secondary" />}>Add auth</SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Auth starter options</SheetTitle>
          <SheetDescription>
            This starter kit begins with no auth. Pick a provider when the app
            is ready for real user flows.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <AuthCommandCard
            label="WorkOS AuthKit"
            description="Good fit when you want a polished hosted auth setup."
            command={authCommands.authkit}
          />
          <AuthCommandCard
            label="Clerk"
            description="Use Clerk if the product already uses Clerk or wants its hosted features."
            command={authCommands.clerk}
          />
          <AuthCommandCard
            label="Convex Auth"
            description="Good default when you want auth handled directly inside the Convex ecosystem."
            command={authCommands.convexauth}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AuthCommandCard({
  label,
  description,
  command,
}: {
  label: string;
  description: string;
  command: string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <code className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          {command}
        </code>
      </CardContent>
    </Card>
  );
}
