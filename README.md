# Notely — Professional AI-Powered Note-Taking App

A modern, full-stack note-taking application transformed from a basic CRUD app into a professional-grade platform with advanced features, beautiful UI, and robust AI integration. Built with Next.js 14, TypeScript, Supabase, and a custom multi-provider translation service.

## ✨ Features

### Core Functionality
- **Professional Note Management**: Create, edit, delete, and organize notes with advanced features
- **Template System**: 8 professional templates (Meeting Notes, Project Planning, Daily Journal, etc.)
- **Enhanced Editor**: Rich text editing with markdown support and AI integration
- **Smart Organization**: Tags, search, filtering, and related notes suggestions

### AI Integration
- **Multi-Provider Translation**: Robust translation service with dictionary fallbacks
- **Content Enhancement**: Summarization, expansion, and translation capabilities
- **Smart Tagging**: Auto-applies tags from content (stocks, crypto, urgent, tasks, etc.)
- **Voice-to-Text**: Dictation via Web Speech API

### Modern UI/UX
- **Professional Design**: Glassmorphism effects with Inter font typography
- **Dark/Light Themes**: Comprehensive theme system with smooth transitions
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Micro-interactions**: Smooth animations and hover effects

### Advanced Features
- **Auto-save**: Automatic saving with visual status indicators
- **Reminders**: Browser notifications for time-sensitive notes
- **Market Data**: Crypto (CoinGecko) and stock (Stooq) price references
- **Analytics**: Usage statistics and activity tracking
- **Delete Confirmation**: User-friendly delete operations with confirmation modals

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (@supabase/supabase-js, @supabase/ssr) for DB + Auth
- Optional OpenAI API for GenAI

## Getting started

1) Install dependencies

```
npm install
```

2) Configure environment

Create `.env.local` (already included with provided Supabase credentials):

```
NEXT_PUBLIC_SUPABASE_URL=https://ukgfziwsrvmwayeovigk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...anon key...

# Optional for GenAI features
OPENAI_API_KEY=
```

3) Create the database schema in your Supabase project

Copy contents of `supabase.sql` and run it in Supabase SQL editor. Enable Email (magic link) or OAuth in Supabase Authentication if desired.

4) Run the app

```
npm run dev
```

Open http://localhost:3000.

## Notes

- Auth: use the Sign in page for magic link auth. After signing in, your notes will display.
- Reminders: your browser will request notification permission to schedule reminders locally.
- Voice-to-text: uses the Web Speech API, which may require Chrome-based browsers.
- GenAI: without OPENAI_API_KEY set, endpoints fall back to simple behavior (truncate/append/pass-through).
- Market data: crypto via CoinGecko, stocks via Stooq (no API keys required).

## Project structure

- `src/app` — App Router pages and API routes
- `src/components` — UI components (NoteEditor, ThemeToggle, MarketLookup, etc.)
- `src/lib` — utilities (supabase clients, tagging, reminders, related)
- `supabase.sql` — DB schema

24005826G_lab2_V2
