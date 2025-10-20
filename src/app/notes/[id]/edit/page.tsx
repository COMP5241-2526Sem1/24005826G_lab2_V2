import { supabaseServer } from '@/lib/supabaseServer'
import { NoteEditor } from '@/components/NoteEditor'
import { redirect } from 'next/navigation'

export default async function EditNotePage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')
  const { data: note, error } = await supabase.from('notes').select('*').eq('id', params.id).single()
  if (error || !note) return redirect('/notes')

  async function onSave(payload: { title: string; content: string; tags: string[]; reminder_at: string | null }) {
    'use server'
    const supabase = supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth')
    const { error } = await supabase.from('notes').update({
      title: payload.title,
      content: payload.content,
      tags: payload.tags,
      reminder_at: payload.reminder_at,
    }).eq('id', params.id)
    if (error) throw new Error(error.message)
    redirect(`/notes/${params.id}`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit Note</h1>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Server Action passed as prop */}
      <NoteEditor onSave={onSave} initial={note} />
    </div>
  )
}
