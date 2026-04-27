import { eq } from "drizzle-orm";
import { MailIcon } from "lucide-react";

import { ActiveSectionProvider } from "@/components/dashboard/active-section-context";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DensityProvider } from "@/components/dashboard/density-context";
import { PlatformIcon } from "@/components/dashboard/platform-icon";
import { TimeframeProvider } from "@/components/dashboard/timeframe-context";
import { db } from "@/db";
import { socialAccounts, trackedPeople } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Members",
};

async function getMembers() {
  const people = await db
    .select()
    .from(trackedPeople)
    .where(eq(trackedPeople.type, "member"))
    .orderBy(trackedPeople.name);

  const accounts = await db
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.active, true));

  const accountsByPerson = new Map<string, typeof accounts>();
  for (const account of accounts) {
    const list = accountsByPerson.get(account.trackedPersonId) ?? [];
    list.push(account);
    accountsByPerson.set(account.trackedPersonId, list);
  }

  return people.map((person) => ({
    ...person,
    accounts: accountsByPerson.get(person.id) ?? [],
  }));
}

const INITIALS_COLORS = [
  "from-emerald-400 to-cyan-400",
  "from-violet-400 to-fuchsia-400",
  "from-amber-400 to-orange-400",
  "from-rose-400 to-pink-400",
  "from-sky-400 to-indigo-400",
  "from-lime-400 to-emerald-400",
  "from-fuchsia-400 to-rose-400",
  "from-teal-400 to-cyan-400",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getColor(index: number) {
  return INITIALS_COLORS[index % INITIALS_COLORS.length];
}

const PLATFORM_URLS: Record<string, (handle: string) => string> = {
  instagram: (h) => `https://www.instagram.com/${h}`,
  tiktok: (h) => `https://www.tiktok.com/@${h}`,
  youtube: (h) => `https://www.youtube.com/@${h}`,
  facebook: (h) => `https://www.facebook.com/${h}`,
};

type Account = Awaited<ReturnType<typeof getMembers>>[number]["accounts"][number];

export default async function MembersPage() {
  const members = await getMembers();
  const totalAccounts = members.reduce((n, m) => n + m.accounts.length, 0);

  return (
    <TimeframeProvider>
      <ActiveSectionProvider>
        <DensityProvider>
          <div className="isolate flex min-h-dvh bg-surface-base text-white antialiased [font-feature-settings:'ss01','cv11']">
            <AppSidebar />

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="relative overflow-hidden border-b border-white/5 px-6 py-8">
                <div className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-glow/8 blur-[100px]" />
                <div className="relative mx-auto w-full max-w-[1440px]">
                  <p className="font-mono text-[0.625rem] tracking-[0.28em] text-glow/70 uppercase">
                    Directory
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white text-balance">
                    Members
                  </h1>
                  <p className="mt-2 text-sm text-white/50 text-pretty">
                    <span className="tabular-nums font-semibold text-white">{members.length}</span> members
                    {" "}&middot;{" "}
                    <span className="tabular-nums font-semibold text-white">{totalAccounts}</span> tracked accounts
                  </p>
                </div>
              </header>

              <main className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-24">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member, i) => {
                    const personal = member.accounts.filter((a) => a.accountCategory === "personal");
                    const business = member.accounts.filter((a) => a.accountCategory === "business");

                    return (
                      <div
                        key={member.id}
                        className="relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-glow/15 bg-surface-raised p-5 shadow-[0_0_20px_-5px] shadow-glow/10"
                      >
                        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-glow/[0.03] to-transparent" />
                        <div className="relative flex items-start gap-3">
                          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${getColor(i)} text-sm font-semibold text-surface-base`}>
                            {getInitials(member.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="truncate text-[0.9375rem] font-semibold text-white">{member.name}</h2>
                            {member.email && (
                              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[0.75rem] text-white/45">
                                <MailIcon className="size-3 shrink-0" strokeWidth={1.75} />
                                {member.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="relative flex flex-col gap-3">
                          {personal.length > 0 && <HandleGroup label="Personal" accounts={personal} />}
                          {business.length > 0 && <HandleGroup label="Business" accounts={business} />}
                          {member.accounts.length === 0 && (
                            <p className="text-[0.75rem] text-white/30">No social accounts linked</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </main>
            </div>
          </div>
        </DensityProvider>
      </ActiveSectionProvider>
    </TimeframeProvider>
  );
}

function HandleGroup({ label, accounts }: { label: string; accounts: Account[] }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[0.5625rem] tracking-[0.22em] text-white/35 uppercase">
        {label}
      </p>
      <ul role="list" className="flex flex-wrap gap-1.5">
        {accounts.map((account) => (
          <li key={account.id}>
            <a
              href={(PLATFORM_URLS[account.platform] ?? PLATFORM_URLS.instagram)(account.handle)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-glow/10 bg-glow/5 px-2 py-1 text-[0.75rem] text-white/65 hover:border-glow/30 hover:bg-glow/10 hover:text-white"
            >
              <PlatformIcon platform={account.platform} className="size-3 shrink-0" />
              {account.handle}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
