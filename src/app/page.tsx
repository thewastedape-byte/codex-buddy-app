'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, logout, getSubscription } from '@/lib/auth'

const TASK_TYPES = [
  { value: 'complete', label: 'Complete my code' },
  { value: 'fix', label: 'Fix a bug' },
  { value: 'explain', label: 'Explain this code' },
  { value: 'convert', label: 'Convert to another language' },
  { value: 'comment', label: 'Add comments/docstrings' },
  { value: 'optimize', label: 'Optimize/refactor' },
  { value: 'suggest', label: 'Suggest algorithm' },
]

const LANGUAGES = [
  'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C#', 'PHP', 'Ruby', 'SQL', 'HTML/CSS', 'Bash',
]

const selectStyle = {
  background: '#161b22',
  border: '1px solid #30363d',
  borderRadius: 8,
  color: '#e6edf3',
  padding: '10px 14px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}

const inputStyle = {
  background: '#161b22',
  border: '1px solid #30363d',
  borderRadius: 8,
  color: '#e6edf3',
  padding: '10px 14px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}

export default function HomePage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState<'assistant' | 'generator'>('assistant')

  // Assistant mode state
  const [taskType, setTaskType] = useState('complete')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('JavaScript')
  const [assistantResult, setAssistantResult] = useState('')
  const [assistantLoading, setAssistantLoading] = useState(false)
  const [assistantError, setAssistantError] = useState('')
  const [assistantCopied, setAssistantCopied] = useState(false)

  // Generator mode state
  const [genDescription, setGenDescription] = useState('')
  const [genLanguage, setGenLanguage] = useState('Python')
  const [genResult, setGenResult] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [genCopied, setGenCopied] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    if (!auth) {
      router.push('/login')
      return
    }
    const sub = getSubscription()
    if (sub === 'free') {
      router.push('/pricing')
      return
    }
    setUserEmail(auth.email)
    setAuthChecked(true)
  }, [router])

  function handleLogout() {
    logout()
    router.push('/login')
  }

  async function runAssistant() {
    if (!code.trim() && taskType !== 'suggest') {
      setAssistantError('Please paste some code first.')
      return
    }
    setAssistantLoading(true)
    setAssistantError('')
    setAssistantResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskType, code, description, targetLanguage }),
      })
      const data = await res.json()
      if (data.result) {
        setAssistantResult(data.result)
      } else {
        setAssistantError(data.error || 'Something went wrong.')
      }
    } catch {
      setAssistantError('Network error. Please try again.')
    }
    setAssistantLoading(false)
  }

  async function runGenerator() {
    if (!genDescription.trim()) {
      setGenError('Please describe what you want to build.')
      return
    }
    setGenLoading(true)
    setGenError('')
    setGenResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'generate', description: genDescription, language: genLanguage }),
      })
      const data = await res.json()
      if (data.result) {
        setGenResult(data.result)
      } else {
        setGenError(data.error || 'Something went wrong.')
      }
    } catch {
      setGenError('Network error. Please try again.')
    }
    setGenLoading(false)
  }

  function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117' }}>
        <div style={{ color: '#8b949e', fontSize: 14 }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #21262d',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#161b22',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.svg" alt="Logo" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Georgia, serif' }} className="gradient-text">
            CodexBuddy
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#8b949e' }}>{userEmail}</span>
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid #30363d', borderRadius: 6, color: '#8b949e', padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#161b22', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid #30363d' }}>
          {[
            { key: 'assistant', label: '🔧 Code Assistant' },
            { key: 'generator', label: '✨ Code Generator' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'assistant' | 'generator')}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                background: activeTab === tab.key ? '#238636' : 'transparent',
                color: activeTab === tab.key ? '#fff' : '#8b949e',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Assistant Mode */}
        {activeTab === 'assistant' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="panel">
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#e6edf3' }}>Code Assistant</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>Task</label>
                <select value={taskType} onChange={e => setTaskType(e.target.value)} style={selectStyle}>
                  {TASK_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {taskType === 'convert' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>Target Language</label>
                  <select value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)} style={selectStyle}>
                    {LANGUAGES.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>
                  Paste your code here
                </label>
                <textarea
                  className="code-area"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={taskType === 'suggest' ? '// Optional: paste relevant context code' : '// Paste your code here...'}
                  rows={12}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>
                  Describe what you need{' '}
                  {taskType !== 'suggest' && <span style={{ color: '#484f58' }}>(optional)</span>}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={taskType === 'suggest' ? 'e.g. Sort a list of 1M items efficiently' : 'e.g. Add error handling for network failures'}
                  style={inputStyle}
                />
              </div>

              {assistantError && (
                <div style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f85149', fontSize: 13, marginBottom: 16 }}>
                  {assistantError}
                </div>
              )}

              <button onClick={runAssistant} className="btn-green" disabled={assistantLoading}>
                {assistantLoading ? 'Running...' : 'Run CodexBuddy ⚡'}
              </button>
            </div>

            {assistantResult && (
              <div className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#8b949e' }}>Result</h3>
                  <button
                    onClick={() => copyToClipboard(assistantResult, setAssistantCopied)}
                    style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, color: assistantCopied ? '#238636' : '#c9d1d9', padding: '5px 12px', cursor: 'pointer', fontSize: 12 }}
                  >
                    {assistantCopied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <pre style={{
                  background: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 8,
                  padding: 16,
                  overflow: 'auto',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 13,
                  color: '#e6edf3',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: 500,
                }}>
                  <code>{assistantResult}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Code Generator Mode */}
        {activeTab === 'generator' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="panel">
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#e6edf3' }}>Code Generator</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>
                  Describe what you want to build
                </label>
                <textarea
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: 100,
                    fontFamily: 'system-ui, sans-serif',
                  } as React.CSSProperties}
                  value={genDescription}
                  onChange={e => setGenDescription(e.target.value)}
                  placeholder="e.g. A REST API endpoint that accepts a user ID and returns their profile from a database"
                  rows={4}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#8b949e' }}>Language</label>
                <select value={genLanguage} onChange={e => setGenLanguage(e.target.value)} style={selectStyle}>
                  {LANGUAGES.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {genError && (
                <div style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f85149', fontSize: 13, marginBottom: 16 }}>
                  {genError}
                </div>
              )}

              <button onClick={runGenerator} className="btn-green" disabled={genLoading}>
                {genLoading ? 'Generating...' : 'Generate Code ⚡'}
              </button>
            </div>

            {genResult && (
              <div className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#8b949e' }}>Generated Code</h3>
                  <button
                    onClick={() => copyToClipboard(genResult, setGenCopied)}
                    style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, color: genCopied ? '#238636' : '#c9d1d9', padding: '5px 12px', cursor: 'pointer', fontSize: 12 }}
                  >
                    {genCopied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <pre style={{
                  background: '#0d1117',
                  border: '1px solid #21262d',
                  borderRadius: 8,
                  padding: 16,
                  overflow: 'auto',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 13,
                  color: '#e6edf3',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: 500,
                }}>
                  <code>{genResult}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
