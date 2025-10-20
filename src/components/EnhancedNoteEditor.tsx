'use client'

import { useState, useRef, useEffect } from 'react'
import { ManusAI } from './ManusAI'
import { autoTags } from '@/lib/smartTagging'

interface NoteEditorProps {
  initial?: { title?: string; content?: string; tags?: string[]; reminder_at?: string | null }
  onSave: (data: { title: string; content: string; tags: string[]; reminder_at: string | null }) => Promise<void>
}

export function EnhancedNoteEditor({ initial, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [tags, setTags] = useState<string[]>(initial?.tags || [])
  const [reminderAt, setReminderAt] = useState<string | null>(initial?.reminder_at || null)
  const [tagInput, setTagInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish')
  const [showAI, setShowAI] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const auto = autoTags(`${title}\n${content}`)
    const merged = Array.from(new Set([...(initial?.tags ?? []), ...auto]))
    setTags(merged)
  }, [title, content, initial?.tags])

  const handleSave = async () => {
    if (busy) return
    setBusy(true)
    setSaveStatus('saving')
    try {
      await onSave({ title, content, tags, reminder_at: reminderAt })
      setSaveStatus('saved')
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('unsaved')
    } finally {
      setBusy(false)
    }
  }

  const addTag = () => {
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setTagInput('')
      setSaveStatus('unsaved')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
    setSaveStatus('unsaved')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // AI Functions
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
      try { data = JSON.parse(raw) } catch { 
        alert('Translation service error. Please try again later.'); 
        return 
      }
      if (data.translated) {
        setContent(data.translated)
        setSaveStatus('unsaved')
      }
      else if (data.error) {
        alert(`Translation error: ${data.error}`)
      }
      else {
        alert('Translation failed. Please try again later.')
      }
    } catch (error) {
      console.error('Translation error:', error)
      alert('Translation service is currently unavailable. Please try again later.')
    } finally { 
      setBusy(false) 
    }
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
      if (data.summary) {
        setContent(data.summary)
        setSaveStatus('unsaved')
      }
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
      if (data.expanded) {
        setContent(data.expanded)
        setSaveStatus('unsaved')
      }
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
      if (data.improved) {
        setContent(data.improved)
        setSaveStatus('unsaved')
      }
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
      if (data.title) {
        setTitle(data.title)
        setSaveStatus('unsaved')
      }
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
        const newTags = data.tags.filter((tag: string) => !tags.includes(tag))
        setTags([...tags, ...newTags])
        setSaveStatus('unsaved')
      }
      else if (data.error) alert(data.error)
    } finally { setBusy(false) }
  }

  const startDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setBusy(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setContent(content + (content ? ' ' : '') + transcript)
      setSaveStatus('unsaved')
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      alert('Speech recognition error: ' + event.error)
    }

    recognition.onend = () => {
      setBusy(false)
    }

    recognition.start()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {title || 'Untitled Note'}
          </h1>
          <div className="flex items-center space-x-2">
            {saveStatus === 'saving' && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Saving...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Saved</span>
              </div>
            )}
            {saveStatus === 'unsaved' && (
              <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`btn-secondary ${showAI ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Assistant
          </button>
          <button
            onClick={handleSave}
            disabled={busy || saveStatus === 'saved'}
            className="btn-primary"
          >
            {busy ? (
              <div className="animate-pulse w-4 h-4 bg-white rounded-full"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
            Save Note
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Title Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Note Title
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setSaveStatus('unsaved')
                }}
                className="input-field flex-1 text-lg font-medium"
                placeholder="Enter a compelling title..."
              />
              <button
                onClick={generateTitle}
                disabled={busy || !content.trim()}
                className="btn-secondary whitespace-nowrap"
                title="Generate title from content"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Auto Title
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Note Content
            </label>
            <div className="relative">
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setSaveStatus('unsaved')
                }}
                className="input-field min-h-[500px] resize-y font-mono text-sm leading-7 tracking-wide"
                placeholder="Start writing your ideas... Use AI assistance to enhance your content."
              />
              {content.length === 0 && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="text-center space-y-3 text-slate-400 dark:text-slate-500">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <div>
                      <p className="text-lg font-medium">Ready to capture your thoughts?</p>
                      <p className="text-sm">Start typing or use voice input to begin</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Enhancement Tools */}
          <div className="card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Enhancement Tools
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={summarizeContent}
                disabled={busy || !content.trim()}
                className="btn-secondary text-sm p-3 flex flex-col items-center space-y-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Summarize</span>
              </button>
              <button
                onClick={expandContent}
                disabled={busy || !content.trim()}
                className="btn-secondary text-sm p-3 flex flex-col items-center space-y-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Expand</span>
              </button>
              <button
                onClick={improveContent}
                disabled={busy || !content.trim()}
                className="btn-secondary text-sm p-3 flex flex-col items-center space-y-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Improve</span>
              </button>
              <button
                onClick={startDictation}
                disabled={busy}
                className="btn-secondary text-sm p-3 flex flex-col items-center space-y-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Voice Input</span>
              </button>
            </div>
            
            {/* Translation */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="input-field w-40"
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
              <button
                onClick={translate}
                disabled={busy || !content.trim()}
                className="btn-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Translate to {selectedLanguage}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Tags</h3>
              <button
                onClick={generateAITags}
                disabled={busy || !content.trim()}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                title="Generate tags with AI"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field flex-1 text-sm"
                placeholder="Add tag..."
              />
              <button
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="btn-secondary text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="card p-6 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Characters:</span>
                <span className="font-medium">{content.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Words:</span>
                <span className="font-medium">{content.trim() ? content.trim().split(/\s+/).length.toLocaleString() : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Lines:</span>
                <span className="font-medium">{content.split('\n').length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Reading time:</span>
                <span className="font-medium">{Math.ceil((content.trim().split(/\s+/).length || 0) / 200)} min</span>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="card p-6 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Reminder</h3>
            <input
              type="datetime-local"
              value={reminderAt || ''}
              onChange={(e) => {
                setReminderAt(e.target.value || null)
                setSaveStatus('unsaved')
              }}
              className="input-field text-sm"
            />
            {reminderAt && (
              <button
                onClick={() => {
                  setReminderAt(null)
                  setSaveStatus('unsaved')
                }}
                className="text-red-600 dark:text-red-400 text-sm hover:underline"
              >
                Clear reminder
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {showAI && (
        <ManusAI 
          onClose={() => setShowAI(false)}
          currentContent={content}
          onContentInsert={(text) => {
            setContent(content + (content ? '\n\n' : '') + text)
            setSaveStatus('unsaved')
          }}
        />
      )}
    </div>
  )
}