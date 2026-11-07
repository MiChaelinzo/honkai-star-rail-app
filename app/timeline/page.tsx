import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getGameWarpRecords } from "@/lib/db"
import { getGame } from "@/lib/games"
import { resolvePageContext } from "@/lib/page-context"
import { isPremium } from "@/lib/premium"
import { AppShell } from "@/components/app-shell"
import { PremiumGate } from "@/components/premium-gate"
import { WarpTimeline } from "@/components/warp-timeline"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarRange } from "lucide-react"

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { gameId } = await resolvePageContext(searchParams)
  const game = getGame(gameId)
  const supporter = !!user.isSupporter
  const locked = isPremium("timeline") && !supporter

  // Build chronological five-star entries with the pity each one landed on.
  const records = await getGameWarpRecords(user.email, gameId)
  const entries: Array<{
    id: string
    name: string
    rarity: 3 | 4 | 5
    pulledAt: number
    fiftyFifty?: "win" | "loss"
    banner: string
    pityAt: number
  }> = []

  for (const rec of records) {
    // rec.pulls are newest-first; walk oldest-first to accumulate pity.
    const chrono = [...rec.pulls].reverse()
    let sincePrev = 0
    for (const p of chrono) {
      sincePrev += 1
      if (p.rarity === 5) {
        entries.push({
          id: p.id,
          name: p.name,
          rarity: p.rarity,
          pulledAt: p.pulledAt,
          fiftyFifty: p.won5050 === undefined ? undefined : p.won5050 ? "win" : "loss",
          banner: rec.bannerType,
          pityAt: sincePrev,
        })
        sincePrev = 0
      }
    }
  }
  entries.sort((a, b) => b.pulledAt - a.pulledAt)

  return (
    <AppShell gameId={gameId} displayName={user.displayName} isSupporter={supporter} supporterStatus={user.supporterStatus} isAdmin={user.isAdmin}>
      <div className="starfield min-h-screen px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${game.accent}26`, color: game.accent }}
            >
              <CalendarRange className="size-6" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">Timeline</h1>
              <p className="text-muted-foreground">Your five-star journey through {game.name}, month by month</p>
            </div>
          </div>

          <PremiumGate isSupporter={!locked} title="Timeline">
            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="py-6">
                <WarpTimeline gameId={gameId} entries={entries} />
              </CardContent>
            </Card>
          </PremiumGate>
        </div>
      </div>
    </AppShell>
  )
}
