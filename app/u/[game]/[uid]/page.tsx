import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getStatsByUid, getGameProfile, getPercentiles } from "@/lib/db"
import { getGame, isGameId, type GameId } from "@/lib/games"
import { computeAchievements, earnedCount } from "@/lib/achievements"
import { StreakAchievements } from "@/components/streak-achievements"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Trophy, Layers, Sparkles, Gauge, TrainFront } from "lucide-react"

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string; uid: string }>
}): Promise<Metadata> {
  const { game, uid } = await params
  if (!isGameId(game)) return { title: "Profile not found" }
  const g = getGame(game)
  const stats = await getStatsByUid(game, uid).catch(() => null)
  if (!stats) return { title: "Profile not found · Astral Warp Archive" }
  const title = `${stats.displayName} · ${g.name} luck profile`
  const description = `${stats.fiveStars} five-stars across ${stats.totalPulls.toLocaleString()} ${g.pullPlural.toLowerCase()} · luck score ${stats.luckyScore}. See how they stack up on Astral Warp Archive.`
  return { title, description, openGraph: { title, description }, twitter: { card: "summary", title, description } }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ game: string; uid: string }>
}) {
  const { game, uid } = await params
  if (!isGameId(game)) notFound()
  const g = getGame(game)
  const gameId = game as GameId

  const stats = await getStatsByUid(gameId, uid).catch(() => null)
  if (!stats) notFound()

  const [profile, percentiles] = await Promise.all([
    getGameProfile(stats.email, gameId).catch(() => null),
    getPercentiles(stats.email, gameId).catch(() => null),
  ])

  const accent = g.accent
  const winRate = Math.round(stats.win5050Rate * 100)
  const achievements = computeAchievements(stats)
  const badgesEarned = earnedCount(achievements)

  const summary = [
    { icon: Layers, label: `Total ${g.pullPlural.toLowerCase()}`, value: stats.totalPulls.toLocaleString() },
    { icon: Star, label: "Five-stars", value: String(stats.fiveStars) },
    { icon: Gauge, label: "Avg 5★ pity", value: stats.avgFivePity ? stats.avgFivePity.toFixed(1) : "—" },
    { icon: Sparkles, label: "50/50 win rate", value: stats.win5050Rate ? `${winRate}%` : "—" },
  ]

  const showcase = profile?.characters?.slice(0, 8) ?? []

  return (
    <div className="starfield min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrainFront className="size-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">Astral Warp Archive</span>
        </Link>
        <Button render={<Link href="/signup" />} nativeButton={false} size="sm">
          Track your luck
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Identity banner */}
        <Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur">
          <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
          <CardContent className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile?.avatarIcon ? (
                <Image
                  src={profile.avatarIcon || "/placeholder.svg"}
                  alt={`${stats.displayName} avatar`}
                  width={64}
                  height={64}
                  crossOrigin="anonymous"
                  className="size-16 rounded-full border-2 object-cover"
                  style={{ borderColor: accent }}
                  unoptimized
                />
              ) : (
                <span
                  className="flex size-16 items-center justify-center rounded-full text-2xl font-bold"
                  style={{ backgroundColor: `${accent}26`, color: accent }}
                >
                  {stats.displayName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <g.icon className="size-4" style={{ color: accent }} />
                  <span className="text-sm text-muted-foreground">{g.name}</span>
                </div>
                <h1 className="font-heading text-2xl font-bold tracking-tight">{stats.displayName}</h1>
                {stats.uid && <p className="font-mono text-xs text-muted-foreground">UID {stats.uid}</p>}
              </div>
            </div>

            {/* Luck score badge */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Trophy className="size-4" style={{ color: accent }} />
                  <span className="font-heading text-3xl font-bold" style={{ color: accent }}>
                    {stats.luckyScore}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Luck score</p>
              </div>
              {percentiles && (
                <div className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-center">
                  <p className="font-heading text-lg font-bold">{ordinal(Math.max(1, 100 - percentiles.luck))}</p>
                  <p className="text-xs text-muted-foreground">percentile</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summary.map((s) => (
            <Card key={s.label} className="border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="flex items-center gap-3 py-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary" style={{ color: accent }}>
                  <s.icon className="size-5" />
                </span>
                <div>
                  <p className="font-heading text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {percentiles && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Luckier than <span className="font-medium text-foreground">{percentiles.luck}%</span> of{" "}
            {percentiles.totalPlayers.toLocaleString()} tracked {g.name} players · ranked{" "}
            <span className="font-medium text-foreground">#{percentiles.rankLuck}</span>
          </p>
        )}

        {/* Achievement badges */}
        {badgesEarned > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-heading text-lg font-semibold">Badges</h2>
            <StreakAchievements achievements={achievements} accent={accent} compact />
          </section>
        )}

        {/* Showcase characters */}
        {showcase.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-heading text-lg font-semibold">Showcase</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {showcase.map((c) => (
                <Card key={c.id} className="overflow-hidden border-border/60 bg-card/70 backdrop-blur">
                  <div className="relative aspect-[3/4] bg-secondary/40">
                    <Image
                      src={c.portrait || c.icon || "/placeholder.svg"}
                      alt={c.name}
                      fill
                      crossOrigin="anonymous"
                      className="object-cover"
                      unoptimized
                    />
                    <span
                      className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold text-background"
                      style={{ backgroundColor: c.elementColor || accent }}
                    >
                      {c.rank >= 0 ? `E${c.rank}` : ""}
                    </span>
                  </div>
                  <CardContent className="py-3">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Lv. {c.level} · {c.path}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/70 p-8 text-center backdrop-blur">
          <h2 className="font-heading text-xl font-bold">Think you&apos;re luckier?</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Track your own {g.pullPlural.toLowerCase()} across every supported game and claim your spot on the global
            luck leaderboard.
          </p>
          <Button render={<Link href="/signup" />} nativeButton={false} size="lg" className="mt-1">
            Start tracking free
          </Button>
        </div>
      </main>

      <footer className="border-t border-border/60 py-8">
        <p className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          Astral Warp Archive is a fan-made companion tool. Game names are trademarks of their respective owners.
        </p>
      </footer>
    </div>
  )
}
