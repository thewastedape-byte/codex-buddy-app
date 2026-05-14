'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isLoggedIn, getAuth } from '@/lib/auth'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$7.99',
    period: '/month',
    badge: null,
    highlight: false,
    limit: '50 uses/week — resets every Sunday',
    features: [
      '🤖 AI code completion',
      '🐛 Bug finder & fixer',
      '📖 Code explainer',
      '🔄 Code converter (any language)',
      '✍️ Comment & docstring generator',
      '🚀 Optimizer & refactor',
      '💡 Algorithm suggestions',
      '⚡ Code generator from plain English',
      '50 uses per week',
      'Resets every Sunday',
    ],
    cta: 'Get Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    badge: '🔥 MOST POPULAR',
    highlight: true,
    limit: 'Unlimited — no weekly cap',
    features: [
      'Everything in Starter',
      '⚡ Unlimited uses — no cap ever',
      '🚀 Priority processing',
      '🎯 Advanced prompts & longer output',
      'Perfect for daily developers',
      'Best value for power users',
    ],
    cta: 'Go Pro — Unlimited',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (tier: string) => {
    if (!isLoggedIn()) { router.push('/signup'); return }
    setLoading(tier)
    try {
      const auth = getAuth()
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, email: auth?.email }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout error. Please try again.')
    } catch {
      alert('Connection error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '48px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="WastedApe" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(35,134,54,0.5)' }} />
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #238636, #58a6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CodexBuddy
          </h1>
          <p style={{ fontSize: '11px', color: 'rgba(230,237,243,0.4)' }}>by WastedApe</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 'bold', color: '#e6edf3', marginBottom: '10px' }}>
          Choose Your Plan
        </h2>
        <p style={{ color: 'rgba(230,237,243,0.5)', fontSize: '16px' }}>
          7x cheaper than GitHub Copilot. Same AI. No bloat.
        </p>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '700px', margin: '0 auto 40px' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{
            background: plan.highlight ? 'rgba(35,134,54,0.1)' : '#161b22',
            border: `1px solid ${plan.highlight ? 'rgba(35,134,54,0.5)' : '#30363d'}`,
            borderRadius: '20px',
            padding: '32px',
            position: 'relative',
            boxShadow: plan.highlight ? '0 0 40px rgba(35,134,54,0.15)' : 'none',
          }}>
            {plan.badge && (
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #238636, #58a6ff)', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', color: '#fff' }}>
                {plan.badge}
              </div>
            )}

            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#e6edf3', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>{plan.name}</h3>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '44px', fontWeight: 'bold', color: '#e6edf3', fontFamily: 'Georgia, serif' }}>{plan.price}</span>
              <span style={{ color: 'rgba(230,237,243,0.45)', fontSize: '14px', marginLeft: '4px' }}>{plan.period}</span>
            </div>
            <p style={{ fontSize: '12px', color: plan.highlight ? '#58a6ff' : 'rgba(230,237,243,0.5)', marginBottom: '24px', fontWeight: plan.highlight ? 'bold' : 'normal' }}>
              {plan.limit}
            </p>

            <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
              {plan.features.map(f => (
                <li key={f} style={{ padding: '7px 0', fontSize: '13px', color: 'rgba(230,237,243,0.8)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#238636', fontSize: '14px' }}>✓</span>{f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={!!loading}
              style={{
                width: '100%', padding: '14px',
                background: plan.highlight ? 'linear-gradient(135deg, #238636, #2ea043)' : '#21262d',
                border: plan.highlight ? 'none' : '1px solid #30363d',
                borderRadius: '10px', color: '#fff',
                fontSize: '15px', fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading === plan.id ? 0.7 : 1,
              }}
            >
              {loading === plan.id ? 'Loading...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(230,237,243,0.3)' }}>
        Already have access?{' '}
        <Link href="/login" style={{ color: '#58a6ff', textDecoration: 'none' }}>Sign in</Link>
        {' · '}Cancel anytime · Secure payment via Stripe
      </p>
    </div>
  )
}
