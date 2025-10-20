import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import { similarity } from '@/lib/related'

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')
  const { data: note, error } = await supabase.from('notes').select('*').eq('id', params.id).single()
  if (error || !note) return redirect('/notes')

  async function remove() {
    'use server'
    const supabase = supabaseServer()
    const { error } = await supabase.from('notes').delete().eq('id', params.id)
    if (error) throw new Error(error.message)
    redirect('/notes')
  }

  // simple related notes
  const { data: allNotes } = await supabase
    .from('notes')
    .select('id, title, content')
    .eq('user_id', user.id)
    .neq('id', params.id)
  const related = (allNotes ?? [])
    .map(n => ({ n, s: similarity(note.content, n.content) }))
    .sort((a,b)=>b.s-a.s)
    .slice(0,3)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{note.title || 'Untitled'}</h1>
        <div className="flex gap-2">
          <Link className="px-3 py-2 rounded border" href={`/notes/${params.id}/edit`}>Edit</Link>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore Server Action */}
          <form action={remove}><button className="px-3 py-2 rounded border" type="submit">Delete</button></form>
        </div>
      </div>
      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{note.content}</div>
      <div className="text-sm text-gray-500">Tags: {(note.tags ?? []).join(', ') || '—'}</div>
      <div>
        <div className="text-sm text-gray-500 mb-1">Related notes</div>
        <ul className="text-sm list-disc pl-5">
          {related.map(r => (
            <li key={r.n.id}><Link className="underline" href={`/notes/${r.n.id}`}>{r.n.title || 'Untitled'}</Link></li>
          ))}
          {related.length === 0 && <li>—</li>}
        </ul>
      </div>
    </div>
  )
}
