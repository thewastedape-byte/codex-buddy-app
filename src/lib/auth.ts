'use client'

const AUTH_KEY = 'codex_buddy_auth'
const USERS_KEY = 'codex_buddy_users'
const WEEKLY_KEY = 'codex_buddy_weekly'
const ADMIN_EMAILS = ['thewastedape@gmail.com', 'howirolloldschool@gmail.com']
const STARTER_WEEKLY_LIMIT = 50  // Starter: 50 uses/week
// Pro: unlimited

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day
  const sunday = new Date(now.setDate(diff))
  return sunday.toISOString().split('T')[0]
}

export function getUsers(): Record<string, { password: string; name: string }> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
}

export function signup(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  if (users[email]) return { success: false, error: 'An account with this email already exists.' }
  users[email] = { password, name: email.split('@')[0] }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return { success: true }
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  if (!users[email]) return { success: false, error: 'No account found with this email.' }
  if (users[email].password !== password) return { success: false, error: 'Incorrect password.' }
  const auth = { token: generateToken(), email, name: users[email].name, loginTime: Date.now() }
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  return { success: true }
}

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
  } catch { return null }
}

export function isLoggedIn(): boolean { return getAuth() !== null }
export function logout() { localStorage.removeItem(AUTH_KEY) }

export function getSubscription(): string {
  return getAuth()?.subscription || 'free'
}

export function setSubscription(plan: string): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return
    const auth = JSON.parse(raw)
    auth.subscription = plan
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  } catch {}
}

// Weekly usage — resets every Sunday
export function getWeeklyUsage(): { count: number; weekStart: string } {
  if (typeof window === 'undefined') return { count: 0, weekStart: getWeekStart() }
  const auth = getAuth()
  if (!auth) return { count: 0, weekStart: getWeekStart() }
  try {
    const key = WEEKLY_KEY + '_' + auth.email
    const raw = localStorage.getItem(key)
    if (!raw) return { count: 0, weekStart: getWeekStart() }
    const data = JSON.parse(raw)
    if (data.weekStart !== getWeekStart()) return { count: 0, weekStart: getWeekStart() }
    return data
  } catch { return { count: 0, weekStart: getWeekStart() } }
}

export function incrementWeeklyUsage(): void {
  if (typeof window === 'undefined') return
  const auth = getAuth()
  if (!auth) return
  const key = WEEKLY_KEY + '_' + auth.email
  const current = getWeeklyUsage()
  localStorage.setItem(key, JSON.stringify({ count: current.count + 1, weekStart: getWeekStart() }))
}

export function hasReachedWeeklyLimit(): boolean {
  const sub = getSubscription()
  if (sub === 'pro') return false  // Pro = unlimited
  if (sub === 'starter') return getWeeklyUsage().count >= STARTER_WEEKLY_LIMIT
  return true  // free = no access
}

export function getWeeklyRemaining(): number {
  const sub = getSubscription()
  if (sub === 'pro') return 999  // unlimited
  if (sub === 'starter') return Math.max(0, STARTER_WEEKLY_LIMIT - getWeeklyUsage().count)
  return 0
}

export function getUsageCount(): number { return getWeeklyUsage().count }
export function incrementUsage(): void { incrementWeeklyUsage() }
