import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAllUserStats, seedGameStatsIfEmpty } from "@/lib/db"
import { demoStatsForGame } from "@/lib/demo-data"
import { GAME_IDS } from "@/lib/games"
import { Button } from "@/components/ui/button"
import { TrainFront, Gauge, Trophy, Dices, Globe2, ShieldCheck, LineChart, Coins, Share2, Server, Database, Workflow, Braces, Search, Table2, Orbit } from "lucide-react"

export default async function HomePage() {
  const user = await getCurrentUser()
  if (user) redirect("/dashboard")

  // Ensure each game's board has demo trailblazers so the public stats look alive.
  await Promise.all(GAME_IDS.map((g) => seedGameStatsIfEmpty(g, demoStatsForGame(g)).catch(() => {})))

  const stats = await getAllUserStats().catch(() => [])
  const trailblazers = new Set(stats.map((u) => u.email)).size
  const totalWarps = stats.reduce((s, u) => s + (u.totalPulls || 0), 0)
  const totalFive = stats.reduce((s, u) => s + (u.fiveStars || 0), 0)

  const features = [
    { icon: Gauge, title: "Pity radar", desc: "Live soft and hard pity counters for every banner so you always know how close your next five-star is." },
    { icon: LineChart, title: "Pull predictor", desc: "A real soft-pity probability model shows your exact odds of a five-star over the next 10, 20, or 90 pulls." },
    { icon: Dices, title: "50/50 history", desc: "Track every win and loss on limited banners and see your true rate-up win percentage." },
    { icon: Coins, title: "Spending insights", desc: "See the estimated currency and real-money value behind your pulls, plus your true cost per five-star." },
    { icon: Trophy, title: "Global leaderboard", desc: "Compare luck scores, pull counts, and five-star hauls with trailblazers around the world." },
    { icon: Share2, title: "Shareable profiles", desc: "Show off your luck score, percentile, and showcase characters with a public link anyone can open." },
    { icon: Globe2, title: "Built to scale", desc: "Powered by Amazon DynamoDB with single-digit millisecond reads, ready for millions of trailblazers." },
    { icon: ShieldCheck, title: "Seven games, one home", desc: "Star Rail, Genshin, Zenless Zone Zero, Honkai Impact 3rd, Wuthering Waves, Arknights, and Endfield — all tracked side by side." }
  ]

  return (
    <div className="starfield min-h-dvh">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrainFront className="size-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">Astral Warp Archive</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button render={<Link href="/login" />} nativeButton={false} variant="ghost" size="sm">
            Sign in
          </Button>
          <Button render={<Link href="/signup" />} nativeButton={false} size="sm">
            Get started
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="aurora relative mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="size-3.5" />
              7 gacha games · Million-scale global app
            </span>
            <h1 className="text-balance font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Master your pulls across the <span className="text-primary">gacha</span> multiverse
            </h1>
            <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
              Track Star Rail warps, Genshin wishes, Zenless signals, Honkai supplies, Wuthering Waves convenes, Arknights headhunting, and Endfield recruitment in one place. Watch your pity climb and outshine players everywhere on the global luck leaderboard.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
                Start tracking free
              </Button>
              <Button render={<Link href="/login" />} nativeButton={false} size="lg" variant="outline">
                I have an account
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border/60 shadow-2xl shadow-primary/10">
              <Image
                src="/astral-warp-archive-hero.png"
                alt="Astral Warp Archive dashboard surrounded by characters and a cosmic train"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-14 grid grid-cols-3 gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
          <Stat label="Trailblazers" value={trailblazers.toLocaleString()} />
          <Stat label="Warps logged" value={totalWarps.toLocaleString()} />
          <Stat label="Five-stars pulled" value={totalFive.toLocaleString()} />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Connected infrastructure</p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">A serious toolkit for community-scale data</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">From API testing and schema modeling to high-performance history grids, the archive is designed to grow with every game and every player.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Table2, name: "AG Grid", detail: "Fast, filterable pull history" },
            { icon: Server, name: "Render", detail: "Scalable backend hosting" },
            { icon: Workflow, name: "Zapier", detail: "Supporter status workflows" },
            { icon: Braces, name: "Postman", detail: "API collections and mocks" },
            { icon: Search, name: "Elastic", detail: "Global telemetry search" },
            { icon: Orbit, name: "Astropods", detail: "Asset and telemetry sync" },
            { icon: Database, name: "KERNEL", detail: "Core data utilities" },
            { icon: Globe2, name: "APIMatic", detail: "SDK schema translation" },
          ].map((tool) => (
            <div key={tool.name} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><tool.icon className="size-4" /></span>
              <div><p className="text-sm font-semibold">{tool.name}</p><p className="text-xs text-muted-foreground">{tool.detail}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border/60 bg-card/70 p-5 backdrop-blur">
              <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="font-heading text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <p className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          Astral Warp Archive is a fan-made companion tool. Honkai: Star Rail, Genshin Impact, Zenless Zone Zero, Honkai Impact 3rd, Wuthering Waves,
          Arknights, and Arknights: Endfield are trademarks of their respective owners.
        </p>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-heading text-2xl font-bold text-primary md:text-3xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground md:text-sm">{label}</p>
    </div>
  )
}
