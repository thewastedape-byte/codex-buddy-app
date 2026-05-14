'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signup } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const result = signup(email, password)
    if (result.success) {
      router.push('/pricing')
    } else {
      setError(result.error || 'Signup failed.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117' }}>
      <div className="panel" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo.svg" alt="Logo" style={{ width: 56, height: 56, borderRadius: '50%', marginBottom: 12 }} />
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Georgia, serif' }} className="gradient-text">
            CodexBuddy
          </h1>
          <p style={{ color: '#8b949e', marginTop: 4, fontSize: 14 }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '10px 14px', background: '#0d1117',
                border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 14,
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', background: '#0d1117',
                border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 14,
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', background: '#0d1117',
                border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f85149', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-green" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8b949e' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#58a6ff', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
