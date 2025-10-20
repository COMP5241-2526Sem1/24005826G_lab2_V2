"use client"
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()
  const current = resolvedTheme || theme || 'system'
  const toggle = () => setTheme(current === 'dark' ? 'light' : 'dark')
  return (
    <button className="rounded px-2 py-1 border text-xs" onClick={toggle}>
      {current === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
