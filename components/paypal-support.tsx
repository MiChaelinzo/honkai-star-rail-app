"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function PayPalSupport() {
  const [pending, setPending] = useState(false)

  async function startCheckout() {
    setPending(true)
    try {
      const response = await fetch("/api/paypal/order", { method: "POST" })
      const data = await response.json()
      if (!response.ok || !data.url) throw new Error(data.error || "PayPal checkout is unavailable.")
      window.location.assign(data.url)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PayPal checkout is unavailable.")
      setPending(false)
    }
  }

  return (
    <Button type="button" variant="outline" onClick={startCheckout} disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
      Support with PayPal
    </Button>
  )
}
