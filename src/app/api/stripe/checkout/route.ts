export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

const PRICES: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || '',
  pro:     process.env.STRIPE_PRICE_PRO     || '',
}

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as any })
    const { tier, email } = await req.json()
    const priceId = PRICES[tier]
    if (!priceId) return NextResponse.json({ error: 'Price not configured' }, { status: 503 })
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      subscription_data: { metadata: { tier } },
    })
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
