'use client'

export interface User {
  email: string
  name: string
}

const AUTH_KEY = 'codex_buddy_auth'
const USERS_KEY = 'codex_buddy_users'
const USAGE_KEY = 'codex_buddy_usage'

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getUsers(): Record<string, { password: string; name: string }> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function signup(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  if (users[email]) {
    return { success: false, error: 'An account with this email already exists.' }
  }
  users[email] = { password, name: email.split('@')[0] }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return { success: true }
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  if (!users[email]) {
    return { success: false, error: 'No account found with this email.' }
  }
  if (users[email].password !== password) {
    return { success: false, error: 'Incorrect password.' }
  }
  const token = generateToken()
  const auth = { token, email, name: users[email].name, loginTime: Date.now() }
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  return { success: true }
}

const ADMIN_EMAILS = ['thewastedape@gmail.com', 'howirolloldschool@gmail.com']

export function getAuth(): { token: string; email: string; name: string; subscription?: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const auth = JSON.parse(raw)
    if (auth?.email && ADMIN_EMAILS.includes(auth.email.toLowerCase())) {
      return { ...auth, subscription: 'pro' }
    }
    return auth
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getAuth() !== null
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function getUsageCount(): number {
  if (typeof window === 'undefined') return 0
  const auth = getAuth()
  if (!auth) return 0
  const key = USAGE_KEY + '_' + auth.email
  try {
    const raw = localStorage.getItem(key)
    return raw ? parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return
  const auth = getAuth()
  if (!auth) return
  const key = USAGE_KEY + '_' + auth.email
  const current = getUsageCount()
  localStorage.setItem(key, String(current + 1))
}

export function getSubscription(): string {
  const auth = getAuth()
  return auth?.subscription || 'free'
}

export function setSubscription(plan: string): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return
  try {
    const auth = JSON.parse(raw)
    auth.subscription = plan
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  } catch {}
}
