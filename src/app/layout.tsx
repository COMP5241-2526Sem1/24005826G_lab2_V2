import './globals.css'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
// import UserMenu from '@/components/UserMenu'

export const metadata = {
  title: 'Notely — AI-Powered Note Taking',
  description: 'Professional note-taking with AI assistance, smart organization, and beautiful design.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            <header className="glass sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-8">
                    <a href="/" className="flex items-center space-x-2 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        N
                      </div>
                      <span className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Notely
                      </span>
                    </a>
                    <nav className="hidden md:flex items-center space-x-6">
                      <a href="/notes" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                        Notes
                      </a>
                      <a href="/analytics" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                        Analytics
                      </a>
                    </nav>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    {/* <UserMenu /> */}
                    <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                    <a href="/notes/new" className="btn-primary text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New Note
                    </a>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
            <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span>Built with Next.js + Supabase</span>
                    <span>•</span>
                    <span>AI-Powered Notes</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                      Privacy
                    </a>
                    <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                      Terms
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
