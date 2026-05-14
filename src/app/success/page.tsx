'use client'

import { useEffect } from 'react'
import { setSubscription } from '@/lib/auth'

export default function SuccessPage() {
  useEffect(() => {
    setSubscription('pro')
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117' }}>
      <div className="panel" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 12 }} className="gradient-text">
          You&apos;re in!
        </h1>
        <p style={{ color: '#c9d1d9', fontSize: 16, marginBottom: 8 }}>
          Start coding with AI.
        </p>
        <p style={{ color: '#8b949e', fontSize: 14, marginBottom: 32 }}>
          Your Pro access is now active. Welcome to CodexBuddy.
        </p>
        <a
          href="/"
          className="btn-green"
          style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 32px', fontSize: 15 }}
        >
          Open CodexBuddy ⚡
        </a>
      </div>
    </div>
  )
}
