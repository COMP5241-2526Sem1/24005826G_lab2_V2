"use client"
import { useEffect, useState } from 'react'
import { autoTags } from '@/lib/smartTagging'
import { scheduleReminder } from '@/lib/reminders'
import { ManusAI } from './ManusAI'

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
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish')

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

  async function translate() {
    if (!content.trim()) {
      alert('Please enter some content to translate.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/genai/translate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, targetLanguage: selectedLanguage }) 
      })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('AI error: ' + raw); return }
      if (data.translated) setContent(data.translated)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  async function summarizeContent() {
    if (!content.trim()) {
      alert('Please enter some content to summarize.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/genai/summarize', { method: 'POST', body: JSON.stringify({ text: content }) })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('AI error: ' + raw); return }
      if (data.summary) setContent(data.summary)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  async function expandContent() {
    if (!content.trim()) {
      alert('Please enter some content to expand.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/genai/expand', { method: 'POST', body: JSON.stringify({ text: content }) })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('AI error: ' + raw); return }
      if (data.expanded) setContent(data.expanded)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  async function improveContent() {
    if (!content.trim()) {
      alert('Please enter some content to improve.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/genai/chat', { 
        method: 'POST', 
        body: JSON.stringify({ action: 'improve', text: content }) 
      })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('AI error: ' + raw); return }
      if (data.improved) setContent(data.improved)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  async function generateTitle() {
    if (!content.trim()) {
      alert('Please enter some content to generate a title.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/genai/chat', { 
        method: 'POST', 
        body: JSON.stringify({ action: 'title', text: content }) 
      })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('AI error: ' + raw); return }
      if (data.title) setTitle(data.title)
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  async function generateAITags() {
    if (!content.trim()) {
      alert('Please enter some content to generate tags.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/genai/chat', { 
        method: 'POST', 
        body: JSON.stringify({ action: 'tags', text: content }) 
      })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { alert('AI error: ' + raw); return }
      if (data.tags && Array.isArray(data.tags)) {
        const merged = Array.from(new Set([...tags, ...data.tags]))
        setTags(merged)
      } else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  return (
    <>
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
        <div className="flex gap-2 items-center text-sm">
          <button type="button" className="px-2 py-1 border rounded" onClick={startDictation}>Voice to text</button>
          <div className="flex items-center gap-2">
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Russian">Russian</option>
              <option value="Arabic">Arabic</option>
            </select>
            <button type="button" className="px-2 py-1 border rounded" onClick={translate} disabled={busy}>
              🌐 Translate
            </button>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">✨ AI Features</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button type="button" className="px-3 py-2 border rounded bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 hover:shadow-sm transition-all" onClick={summarizeContent} disabled={busy}>
              📝 Summarize
            </button>
            <button type="button" className="px-3 py-2 border rounded bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 hover:shadow-sm transition-all" onClick={expandContent} disabled={busy}>
              📈 Expand
            </button>
            <button type="button" className="px-3 py-2 border rounded bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 hover:shadow-sm transition-all" onClick={improveContent} disabled={busy}>
              ✨ Improve
            </button>
            <button type="button" className="px-3 py-2 border rounded bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 hover:shadow-sm transition-all" onClick={generateTitle} disabled={busy}>
              🏷️ Title
            </button>
          </div>
          <button type="button" className="w-full mt-2 px-3 py-2 border rounded bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900 dark:to-cyan-900 hover:shadow-sm transition-all text-sm" onClick={generateAITags} disabled={busy}>
            🏃 Generate AI Tags
          </button>
        </div>
        <label className="block text-sm">Reminder time
          <input type="datetime-local" className="mt-1 block border rounded px-2 py-1" value={reminderAt ? new Date(reminderAt).toISOString().slice(0,16) : ''} onChange={e => setReminderAt(e.target.value ? new Date(e.target.value).toISOString() : null)} />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={busy}>Save</button>
        </div>
      </form>
      
      <ManusAI 
        noteContent={content} 
        onInsertContent={(aiContent) => setContent(c => c ? c + '\n\n' + aiContent : aiContent)} 
      />
    </>
  )
}
