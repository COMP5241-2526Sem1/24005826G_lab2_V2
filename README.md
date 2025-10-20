# Notely — Next.js + Supabase Notes

A full-stack notetaking app with Supabase storage, smart tagging, reminders, voice-to-text, market data references, and GenAI features (summarize, expand, translate).

## Features

- Notes: create, edit, delete, list, and view
- Supabase storage (PostgreSQL) with RLS for per-user notes
- Smart tagging: auto-applies tags from content (stocks, crypto, urgent, tasks, etc.)
- Reminders: browser notifications for time-sensitive notes
- Voice-to-text: dictation via Web Speech API
- Market data: lookup crypto (CoinGecko) or stock (Stooq) and insert price references
- GenAI: summarize, expand, translate notes (uses OPENAI_API_KEY if provided; has graceful fallbacks)
- Related notes: basic suggestions using keyword similarity
- Analytics: counts and most active days
- Responsive UI + Dark mode

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
