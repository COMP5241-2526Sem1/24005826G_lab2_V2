import { supabasePublic } from '@/lib/supabasePublic'
import { EditNoteClient } from '@/components/EditNoteClient'
import { redirect } from 'next/navigation'

export default async function EditNotePage({ params }: { params: { id: string } }) {
  const supabase = supabasePublic()
  const { data: note, error } = await supabase.from('notes').select('*').eq('id', params.id).single()
  if (error || !note) return redirect('/notes')

  async function onSave(_payload: { title: string; content: string; tags: string[]; reminder_at: string | null }) { 'use server' }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit Note</h1>
      <EditNoteClient id={params.id} initial={note} />
    </div>
  )
}
