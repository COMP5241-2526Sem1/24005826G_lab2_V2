import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { ReminderHydrator } from '@/components/ReminderHydrator'

export default async function NotesPage({ searchParams }: { searchParams?: { q?: string; tag?: string } }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-2">Notes</h1>
        <p>Please sign in via Supabase Auth to use notes.</p>
      </div>
    )
  }
  const q = (searchParams?.q ?? '').trim()
  const tag = (searchParams?.tag ?? '').trim()
  let query = supabase.from('notes').select('*').eq('user_id', user.id)
  if (q) {
    // basic ilike match on title or content
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
  }
  if (tag) {
    query = query.contains('tags', [tag])
  }
  const { data: notes } = await query.order('updated_at', { ascending: false })

  return (
    <div className="space-y-4">
  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
  {/* @ts-ignore Server to Client */}
      <ReminderHydrator notes={(notes ?? []).map(n => ({ id: n.id, title: n.title, reminder_at: n.reminder_at }))} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Your Notes</h1>
        <form className="flex items-center gap-2 text-sm" action="/notes">
          <input name="q" defaultValue={q} className="border rounded px-2 py-1" placeholder="Search..." />
          <input name="tag" defaultValue={tag} className="border rounded px-2 py-1" placeholder="#tag" />
          <button className="border rounded px-2 py-1" type="submit">Filter</button>
          <a className="underline" href="/notes">Reset</a>
        </form>
        <Link href="/notes/new" className="px-3 py-2 rounded bg-blue-600 text-white">New Note</Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(notes ?? []).map(n => (
          <li key={n.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <Link href={`/notes/${n.id}`} className="font-medium hover:underline">{n.title || 'Untitled'}</Link>
              <Link href={`/notes/${n.id}/edit`} className="text-xs underline">Edit</Link>
            </div>
            <div className="mt-2 text-xs text-gray-500">{(n.tags ?? []).join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
