import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getTodos } from "@/lib/db"
import { getGame } from "@/lib/games"
import { resolvePageContext } from "@/lib/page-context"
import { isPremium } from "@/lib/premium"
import { AppShell } from "@/components/app-shell"
import { PremiumGate } from "@/components/premium-gate"
import { TodoList } from "@/components/todo-list"
import { ListChecks } from "lucide-react"

export default async function TodoPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { gameId } = await resolvePageContext(searchParams)
  const game = getGame(gameId)
  const supporter = !!user.isSupporter
  const locked = isPremium("todo") && !supporter

  const items = locked ? [] : await getTodos(user.email)

  return (
    <AppShell gameId={gameId} displayName={user.displayName} isSupporter={supporter} supporterStatus={user.supporterStatus} isAdmin={user.isAdmin}>
      <div className="starfield min-h-screen px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${game.accent}26`, color: game.accent }}
            >
              <ListChecks className="size-6" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">Todo List</h1>
              <p className="text-muted-foreground">Track dailies, weeklies, and farming goals across every game</p>
            </div>
          </div>

          <PremiumGate isSupporter={!locked} title="The Todo List">
            <TodoList initialItems={items} />
          </PremiumGate>
        </div>
      </div>
    </AppShell>
  )
}
