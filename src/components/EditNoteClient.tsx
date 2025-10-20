"use client"
import { useRouter } from 'next/navigation'
import { NoteEditor } from '@/components/NoteEditor'

export function EditNoteClient({ id, initial }: { id: string; initial: { title?: string; content?: string; tags?: string[]; reminder_at?: string | null } }) {
  const router = useRouter()
  return (
    <NoteEditor
      initial={initial}
      onSave={async (payload) => {
        const res = await fetch(`/api/notes/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
        const raw = await res.text(); let data: any; try { data = JSON.parse(raw) } catch { alert(raw); return }
        if (data.error) { alert(data.error); return }
        router.push(`/notes/${id}`)
      }}
    />
  )
}

export function DeleteNoteButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <button className="px-3 py-2 rounded border" type="button" onClick={async ()=>{
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      const raw = await res.text(); let data:any; try{ data = JSON.parse(raw) }catch{ alert(raw); return }
      if (data.error) { alert(data.error); return }
      router.push('/notes')
    }}>Delete</button>
  )
}
