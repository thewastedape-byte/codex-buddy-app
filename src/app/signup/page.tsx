'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signup, login, getAuth } from '@/lib/auth'

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') || 'starter'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const tierLabel = tier === 'pro' ? 'Pro — $19.99/mo (Unlimited)' : 'Starter — $7.99/mo (50 uses/week)'
  const tierColor = tier === 'pro' ? '#58a6ff' : '#238636'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    const result = signup(email.trim().toLowerCase(), password)
    if (!result.success) { setError(result.error || 'Signup failed.'); setLoading(false); return }

    login(email.trim().toLowerCase(), password)

    // Go straight to Stripe checkout for selected tier
    try {
      const auth = getAuth()
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, email: auth?.email }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
    } catch {}

    router.push('/pricing')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', padding: 24 }}>
      <div className="panel" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" style={{ width: 52, height: 52, borderRadius: '50%', marginBottom: 12, border: '2px solid rgba(35,134,54,0.4)' }} />
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Georgia, serif', background: 'linear-gradient(135deg, #238636, #58a6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CodexBuddy
          </h1>
          <p style={{ color: '#8b949e', marginTop: 4, fontSize: 13 }}>Create your account</p>
        </div>

        {/* Selected tier banner */}
        <div style={{ background: 'rgba(35,134,54,0.08)', border: `1px solid ${tierColor}40`, borderRadius: 10, padding: '12px 16px', marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#8b949e', marginBottom: 2 }}>Selected plan</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: tierColor }}>{tierLabel}</p>
          <a href="/pricing" style={{ fontSize: 12, color: '#8b949e', textDecoration: 'underline' }}>Change plan</a>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['Email', 'Password', 'Confirm Password'].map((label, i) => (
            <div key={label}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>{label}</label>
              <input
                type={i === 0 ? 'email' : 'password'}
                required
                placeholder={i === 0 ? 'you@example.com' : '••••••••'}
                value={i === 0 ? email : i === 1 ? password : confirm}
                onChange={e => i === 0 ? setEmail(e.target.value) : i === 1 ? setPassword(e.target.value) : setConfirm(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          {error && <div style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f85149', fontSize: 13 }}>{error}</div>}

          <button type="submit" className="btn-green" disabled={loading} style={{ marginTop: 4, fontSize: 15, padding: '13px' }}>
            {loading ? 'Setting up your account...' : `Create Account & Pay →`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8b949e' }}>
          Already have an account? <a href="/login" style={{ color: '#58a6ff', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d1117' }} />}><SignupContent /></Suspense>
}
