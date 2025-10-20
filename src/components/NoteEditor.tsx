"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { autoTags } from '@/lib/smartTagging'
import { scheduleReminder } from '@/lib/reminders'
import { MarketLookup } from './MarketLookup'

type Props = {
  initial?: { title?: string; content?: string; tags?: string[]; reminder_at?: string | null }
  onSave: (payload: { title: string; content: string; tags: string[]; reminder_at: string | null }) => Promise<void>
}

export function NoteEditor({ initial, onSave }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [reminderAt, setReminderAt] = useState<string | null>(initial?.reminder_at ?? null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const auto = autoTags(`${title}\n${content}`)
    const merged = Array.from(new Set([...(initial?.tags ?? []), ...auto]))
    setTags(merged)
  }, [title, content])

  function startDictation() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) {
      alert('SpeechRecognition not supported in this browser')
      return
    }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setContent(c => (c ? c + '\n' : '') + text)
    }
    rec.start()
  }

  async function summarize() {
    setBusy(true)
    try {
      const res = await fetch('/api/genai/summarize', { method: 'POST', body: JSON.stringify({ text: content }) })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('GenAI error: ' + raw); return }
      if (data.summary) setContent(data.summary)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  async function expand() {
    setBusy(true)
    try {
      const res = await fetch('/api/genai/expand', { method: 'POST', body: JSON.stringify({ text: content }) })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('GenAI error: ' + raw); return }
      if (data.expanded) setContent(data.expanded)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  async function translate(target: string) {
    setBusy(true)
    try {
      const res = await fetch('/api/genai/translate', { method: 'POST', body: JSON.stringify({ text: content, target }) })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('GenAI error: ' + raw); return }
      if (data.translated) setContent(data.translated)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  return (
    <form className="space-y-3" onSubmit={async (e) => {
      e.preventDefault()
      setBusy(true)
      try {
        await onSave({ title, content, tags, reminder_at: reminderAt })
        if (reminderAt) scheduleReminder(reminderAt, title || 'Note')
      } finally { setBusy(false) }
    }}>
      <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="w-full min-h-[200px] border rounded p-3" placeholder="Write your note..." value={content} onChange={e => setContent(e.target.value)} />
      <div className="flex flex-wrap gap-2 text-xs">
        {tags.map(t => (
          <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">#{t}</span>
        ))}
      </div>
      <MarketLookup onInsert={(text)=> setContent(c => c + text)} />
      <div className="flex gap-2 items-center text-sm">
        <button type="button" className="px-2 py-1 border rounded" onClick={startDictation}>Voice to text</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={summarize} disabled={busy}>Summarize</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={expand} disabled={busy}>Expand</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => translate('es')} disabled={busy}>Translate → ES</button>
      </div>
      <label className="block text-sm">Reminder time
        <input type="datetime-local" className="mt-1 block border rounded px-2 py-1" value={reminderAt ? new Date(reminderAt).toISOString().slice(0,16) : ''} onChange={e => setReminderAt(e.target.value ? new Date(e.target.value).toISOString() : null)} />
      </label>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={busy}>Save</button>
      </div>
    </form>
  )
}
