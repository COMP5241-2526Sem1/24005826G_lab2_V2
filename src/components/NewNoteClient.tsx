"use client"
import { useRouter } from 'next/navigation'
import { NoteEditor } from '@/components/NoteEditor'

export function NewNoteClient() {
  const router = useRouter()
  return (
    <NoteEditor
      onSave={async (payload) => {
        const res = await fetch('/api/notes', { method: 'POST', body: JSON.stringify(payload) })
        const raw = await res.text()
        let data: any
        try { data = JSON.parse(raw) } catch { alert(raw); return }
        if (data.error) { alert(data.error); return }
        router.push(`/notes/${data.id}`)
      }}
    />
  )
}
