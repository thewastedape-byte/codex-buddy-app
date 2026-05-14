'use client'

import { useState, useEffect } from 'react'
import { getAuth } from '@/lib/auth'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const auth = getAuth()
    if (auth?.email) setEmail(auth.email)
  }, [])

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'pro', email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const features = [
    { icon: '🤖', text: 'AI code completion & generation' },
    { icon: '🐛', text: 'Bug finder & fixer' },
    { icon: '📖', text: 'Code explainer (plain English)' },
    { icon: '🔄', text: 'Code converter (Python ↔ JS ↔ etc)' },
    { icon: '✍️', text: 'Docstring & comment generator' },
    { icon: '🚀', text: 'Code optimizer & refactor suggestions' },
    { icon: '💡', text: 'Algorithm suggestions' },
    { icon: '♾️', text: 'Unlimited usage' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', padding: '40px 20px' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.svg" alt="Logo" style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 14 }} />
          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Georgia, serif' }} className="gradient-text">
            CodexBuddy
          </h1>
          <p style={{ color: '#8b949e', marginTop: 6, fontSize: 15 }}>AI Coding Assistant by WastedApe</p>
        </div>

        <div className="panel" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#58a6ff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pro Access</span>
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: '#e6edf3', marginBottom: 4 }}>$5</div>
          <div style={{ color: '#8b949e', fontSize: 14, marginBottom: 4 }}>every 6 months</div>
          <div style={{ color: '#238636', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>Less than $1/month</div>

          <div style={{ textAlign: 'left', marginBottom: 28 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < features.length - 1 ? '1px solid #21262d' : 'none' }}>
                <span style={{ fontSize: 18, minWidth: 26 }}>{f.icon}</span>
                <span style={{ color: '#c9d1d9', fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f85149', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            className="btn-green"
            disabled={loading}
            style={{ width: '100%', fontSize: 16, padding: '14px 20px' }}
          >
            {loading ? 'Redirecting...' : 'Get Access Now →'}
          </button>

          <p style={{ color: '#8b949e', fontSize: 12, marginTop: 14 }}>
            Secure payment via Stripe · Cancel anytime
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8b949e' }}>
          Already have access?{' '}
          <a href="/login" style={{ color: '#58a6ff', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
