import { eq } from "drizzle-orm";
import Image from "next/image";
import { UsersIcon } from "lucide-react";

import { ActiveSectionProvider } from "@/components/dashboard/active-section-context";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DensityProvider } from "@/components/dashboard/density-context";
import { PlatformIcon } from "@/components/dashboard/platform-icon";
import { TimeframeProvider } from "@/components/dashboard/timeframe-context";
import { db } from "@/db";
import { socialAccounts, trackedPeople } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata = { title: "Members" };

type IgProfile = { followers: number; posts: number; bio: string; verified: boolean };

const IG: Record<string, IgProfile> = {
  "dwolt226": { followers: 931, posts: 395, bio: "Semi professional race car driver and amateur tattoo artist", verified: false },
  "makesandmodels": { followers: 33651, posts: 2533, bio: "Founded on a passion for the experience. Driving to meet your highest expectations.", verified: false },
  "dallpall": { followers: 4117, posts: 503, bio: "Christ is King!! @bricks_slc member #1", verified: false },
  "happi.roofing": { followers: 280, posts: 33, bio: "🏡 Roof Repairs & Installations · Utah", verified: false },
  "manic_mcgoo": { followers: 5951, posts: 75, bio: "UT 📍", verified: false },
  "presidentmccormack": { followers: 4514, posts: 688, bio: "Family, Business, Tattoos, Music, Podcasting and Fun", verified: true },
  "adplemco": { followers: 141, posts: 23, bio: "Athletic Equipment and Flooring for High-end Homes", verified: false },
  "pfs_flooring": { followers: 226, posts: 49, bio: "Premiere Basketball Court Finisher", verified: false },
  "artsmansports": { followers: 484, posts: 22, bio: "Sports equipment & apparel", verified: false },
  "t_montana_est.1992": { followers: 252, posts: 27, bio: "LUKE 10:19", verified: false },
  "toplocalroofing": { followers: 331, posts: 42, bio: "Trusted local experts in all roofing—residential & commercial", verified: false },
  "willsznilsen": { followers: 3281, posts: 93, bio: "@hypercar_ranch @mireauwater", verified: true },
  "hypercar_ranch": { followers: 2624, posts: 37, bio: "Built in different eras. Driven by the same blood.", verified: true },
  "raptor_ranch": { followers: 154, posts: 17, bio: "Ever Thought About Renting A Dinosaur?", verified: false },
  "michaelmchenry": { followers: 12403, posts: 1541, bio: "✖️Concept Gangster✖️", verified: true },
  "brunchmehard": { followers: 23722, posts: 893, bio: "Where EVERY DAY is a special occasion 🥂💫 📍SLC", verified: false },
  "oakwoodfirekitchen": { followers: 11488, posts: 892, bio: "Weekend Brunch Sat & Sun 10:30am! 🔥 Chef Driven & Wood Fired", verified: false },
  "sundayschool": { followers: 5083, posts: 129, bio: "Utah's Rooftop Palate Parlor & Hottest Weekend Brunch Club 🥂", verified: false },
  "themchenrygroup": { followers: 1917, posts: 551, bio: "Utah Restaurant Group focused on experiential concept creation", verified: false },
  "slcprovisions": { followers: 7263, posts: 606, bio: "Modern American craft kitchen ✨ Seasonal, locally sourced", verified: false },
  "dag_slc": { followers: 85, posts: 1, bio: "Commercial Real Estate / Development", verified: false },
  "dagrealestate": { followers: 227, posts: 31, bio: "Commercial / Development 🏙️ Nationwide Broker", verified: false },
  "soarrugs": { followers: 13, posts: 8, bio: "Handmade Rugs & Floor coverings", verified: false },
  "brett.chell": { followers: 15264, posts: 6384, bio: "Founder Cold Bore Tech. $300M Market Cap. Founder BRICKS.", verified: true },
  "bricks_slc": { followers: 9864, posts: 316, bio: "Private Brand Warehouse. Invite only.", verified: false },
  "bricksmotiondaily": { followers: 11, posts: 18, bio: "Fan page for @bricks_slc", verified: false },
  "bricksclipsdaily": { followers: 23, posts: 33, bio: "Daily Clips for @bricks_slc", verified: false },
  "mikehardle": { followers: 28673, posts: 584, bio: "Living a Bucket LIFE · Memento Mori 💀", verified: true },
  "fruitstandstudios": { followers: 1318, posts: 91, bio: "📸 Corporate Culture Creative · Ai Creative · Branding", verified: false },
  "agent_boost": { followers: 3258, posts: 849, bio: "Industry leader in Senior Market Products", verified: false },
  "dinomaglicmd": { followers: 4701, posts: 438, bio: "Board-Certified Plastic Surgeon · Breast | Body | Face", verified: true },
  "drnicholashowland": { followers: 54409, posts: 1702, bio: "🖤 Raising 2 amazing kids · Board Certified Plastic Surgeon", verified: true },
  "ethanshagmaster": { followers: 963, posts: 32, bio: "Long hair don't care 💅", verified: false },
  "happi_acres": { followers: 70776, posts: 52, bio: ".5k+ on tiktok | Free Quality Content", verified: false },
  "nickpanos": { followers: 2360, posts: 299, bio: "Father · Husband · Creator", verified: true },
  "legendmotorco": { followers: 16878, posts: 355, bio: "Simple ° Timeless ° Quality · Hand Built in Salt Lake City", verified: true },
  "dripzenergy": { followers: 5518, posts: 1, bio: "Energy candy ⚡ Caffeine + nootropics 🧠", verified: false },
  "devseui": { followers: 1303, posts: 116, bio: "We good over here.", verified: false },
  "seuiconstruction": { followers: 830, posts: 122, bio: "Salt Lake City, UT 📍 General Contractor", verified: false },
  "justzahm": { followers: 7696, posts: 1719, bio: "Brand Builder | Utah's Concierge · Filmer 🎥", verified: true },
};

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

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
  const totalProfiles = Object.keys(IG).length;
  const totalFollowers = Object.values(IG).reduce((s, p) => s + p.followers, 0);

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
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                    <span>
                      <span className="tabular-nums font-semibold text-white">{members.length}</span> members
                    </span>
                    <span className="text-white/20">&middot;</span>
                    <span>
                      <span className="tabular-nums font-semibold text-white">{totalProfiles}</span> Instagram profiles
                    </span>
                    <span className="text-white/20">&middot;</span>
                    <span>
                      <span className="tabular-nums font-semibold text-white">{formatNum(totalFollowers)}</span> combined IG followers
                    </span>
                    <span className="text-white/20">&middot;</span>
                    <span>
                      <span className="tabular-nums font-semibold text-white">{totalAccounts}</span> total tracked accounts
                    </span>
                  </p>
                </div>
              </header>

              <main className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-24">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {members.map((member) => {
                    const personal = member.accounts.filter((a) => a.accountCategory === "personal");
                    const business = member.accounts.filter((a) => a.accountCategory === "business");
                    const igAccounts = member.accounts.filter((a) => a.platform === "instagram");
                    const nonIgAccounts = member.accounts.filter((a) => a.platform !== "instagram");
                    const memberFollowers = igAccounts.reduce((s, a) => s + (IG[a.handle]?.followers ?? 0), 0);

                    return (
                      <div
                        key={member.id}
                        className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/5 bg-surface-raised"
                      >
                        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
                          <div className="min-w-0 flex-1">
                            <h2 className="truncate text-[0.9375rem] font-semibold text-white">
                              {member.name}
                            </h2>
                            {memberFollowers > 0 && (
                              <p className="mt-0.5 text-[0.75rem] text-white/40">
                                <span className="tabular-nums font-medium text-white/60">{formatNum(memberFollowers)}</span> total IG followers
                              </p>
                            )}
                          </div>
                        </div>

                        {igAccounts.length > 0 && (
                          <ul role="list" className="divide-y divide-white/5">
                            {igAccounts.map((account) => {
                              const ig = IG[account.handle];
                              const avatarPath = `/images/avatars/${account.handle.replace(/[^a-z0-9._-]/gi, "")}.jpg`;
                              return (
                                <li key={account.id} className="px-5 py-3.5">
                                  <div className="flex items-start gap-3">
                                    <a
                                      href={`https://www.instagram.com/${account.handle}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="relative size-10 shrink-0 overflow-hidden rounded-full outline-1 -outline-offset-1 outline-white/10"
                                    >
                                      <Image
                                        src={avatarPath}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    </a>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <a
                                          href={`https://www.instagram.com/${account.handle}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="truncate text-[0.8125rem] font-medium text-white hover:underline"
                                        >
                                          @{account.handle}
                                        </a>
                                        {ig?.verified && (
                                          <svg className="size-3.5 shrink-0 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.3l-3.6-3.6 1.4-1.4 2.2 2.2 5.6-5.6 1.4 1.4-7 7z" />
                                          </svg>
                                        )}
                                        {account.accountCategory === "business" && (
                                          <span className="shrink-0 rounded bg-white/8 px-1.5 py-0.5 text-[0.5625rem] text-white/40">
                                            biz
                                          </span>
                                        )}
                                      </div>
                                      {ig && (
                                        <>
                                          <p className="mt-0.5 truncate text-[0.6875rem] text-white/35">
                                            {ig.bio}
                                          </p>
                                          <div className="mt-2 flex items-center gap-4 text-[0.6875rem]">
                                            <span className="text-white/40">
                                              <span className="tabular-nums font-medium text-white/70">{formatNum(ig.followers)}</span> followers
                                            </span>
                                            <span className="text-white/40">
                                              <span className="tabular-nums font-medium text-white/70">{ig.posts.toLocaleString()}</span> posts
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}

                        {nonIgAccounts.length > 0 && (
                          <div className="border-t border-white/5 px-5 py-3.5">
                            <p className="mb-2 font-mono text-[0.5625rem] tracking-[0.22em] text-white/30 uppercase">
                              Other platforms
                            </p>
                            <ul role="list" className="flex flex-wrap gap-1.5">
                              {nonIgAccounts.map((account) => (
                                <li key={account.id}>
                                  <a
                                    href={(PLATFORM_URLS[account.platform] ?? PLATFORM_URLS.instagram)(account.handle)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/4 px-2 py-1 text-[0.75rem] text-white/60 transition hover:border-white/15 hover:bg-white/8 hover:text-white"
                                  >
                                    <PlatformIcon platform={account.platform} className="size-3 shrink-0" />
                                    {account.handle}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
