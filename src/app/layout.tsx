import './globals.css'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
// import UserMenu from '@/components/UserMenu'

export const metadata = {
  title: 'Notely — Next.js + Supabase Notes',
  description: 'Create, tag, translate notes with market data references.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="border-b sticky top-0 bg-white dark:bg-black/40 backdrop-blur z-10">
              <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <a href="/" className="font-semibold">Notely</a>
                <nav className="flex items-center gap-3 text-sm">
                  <a href="/notes" className="hover:underline">Notes</a>
                  <a href="/analytics" className="hover:underline">Analytics</a>
                  <ThemeToggle />
                  {/* <UserMenu /> */}
                </nav>
              </div>
            </header>
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">{children}</main>
            <footer className="border-t text-xs text-gray-500 py-4 text-center">Built with Next.js + Supabase</footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
