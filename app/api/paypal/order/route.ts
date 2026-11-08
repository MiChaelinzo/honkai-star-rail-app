import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

const PAYPAL_API = "https://api-m.sandbox.paypal.com"

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })
  if (!response.ok) throw new Error("PayPal authentication failed")
  return (await response.json()).access_token as string
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 })

  try {
    const token = await getAccessToken()
    const origin = new URL(request.url).origin
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: user.email,
          description: "Astral Warp Archive Supporter",
          amount: { currency_code: "USD", value: "5.00" },
        }],
        application_context: {
          brand_name: "Astral Warp Archive",
          user_action: "PAY_NOW",
          return_url: `${origin}/api/paypal/capture`,
          cancel_url: `${origin}/settings?paypal=cancelled`,
        },
      }),
      cache: "no-store",
    })
    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: "Could not create PayPal order." }, { status: 502 })
    const approval = data.links?.find((link: { rel: string }) => link.rel === "approve")
    return NextResponse.json({ url: approval?.href })
  } catch {
    return NextResponse.json({ error: "PayPal is temporarily unavailable." }, { status: 503 })
  }
}
