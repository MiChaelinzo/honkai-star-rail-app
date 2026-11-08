import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { setSupporter } from "@/lib/db"

const PAYPAL_API = "https://api-m.sandbox.paypal.com"

export async function GET(request: Request) {
  const user = await getCurrentUser()
  const { searchParams, origin } = new URL(request.url)
  const orderId = searchParams.get("token")
  if (!user || !orderId) return NextResponse.redirect(new URL("/settings?paypal=failed", origin))

  try {
    const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")
    const auth = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })
    const { access_token } = await auth.json()
    const capture = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      cache: "no-store",
    })
    const data = await capture.json()
    if (data.status === "COMPLETED") {
      await setSupporter(user.email, true, "approved")
      return NextResponse.redirect(new URL("/settings?paypal=success", origin))
    }
  } catch {
    // Redirect to the settings page with a safe, user-facing status.
  }
  return NextResponse.redirect(new URL("/settings?paypal=failed", origin))
}
