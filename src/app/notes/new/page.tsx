import { supabaseServer } from '@/lib/supabaseServer'
import { NoteEditor } from '@/components/NoteEditor'
import { redirect } from 'next/navigation'


export default async function NewNotePage() {
  async function onSave(payload: { title: string; content: string; tags: string[]; reminder_at: string | null }) {
    'use server'
    const supabase = supabaseServer()
    const { data, error } = await supabase.from('notes').insert({
      title: payload.title,
      content: payload.content,
      tags: payload.tags,
      reminder_at: payload.reminder_at,
    }).select('id').single()
    if (error) throw new Error(error.message)
    redirect(`/notes/${data!.id}`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Note</h1>
  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
  {/* @ts-ignore Server Action passed as prop */}
      <NoteEditor onSave={onSave} />
    </div>
  )
}
