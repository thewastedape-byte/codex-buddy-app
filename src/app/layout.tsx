import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodexBuddy by WastedApe — AI Coding Assistant',
  description: 'AI-powered coding assistant. Complete, fix, explain, and generate code with GPT-4o.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
