import { redirect } from 'next/navigation'
import { NewNoteClient } from '@/components/NewNoteClient'


export default async function NewNotePage() {
  // We'll call the API from the client instead of using a server action
  async function onSave(payload: { title: string; content: string; tags: string[]; reminder_at: string | null }) {
    'use server'
    // noop to satisfy typing; the real save happens client-side via NoteEditor
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Note</h1>
  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
  {/* @ts-ignore Server Action passed as prop */}
      <NewNoteClient />
    </div>
  )
}
