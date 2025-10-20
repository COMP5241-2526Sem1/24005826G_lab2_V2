'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EnhancedNoteEditor } from './EnhancedNoteEditor'
import { TemplateSelector } from './TemplateSelector'
import { FloatingActionButton } from './FloatingActionButton'
import { type NoteTemplate } from '@/lib/noteTemplates'

export function NewNoteClient() {
  const router = useRouter()
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate | null>(null)

  const handleSave = async (data: { title: string; content: string; tags: string[]; reminder_at: string | null }) => {
    try {
      const res = await fetch('/api/notes', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) 
      })
      const raw = await res.text()
      let result: any
      try { 
        result = JSON.parse(raw) 
      } catch { 
        alert('Server error: ' + raw)
        return 
      }
      
      if (result.error) { 
        alert(result.error)
        return 
      }
      
      router.push(`/notes/${result.id}`)
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    }
  }

  const handleTemplateSelect = (template: NoteTemplate) => {
    setSelectedTemplate(template)
    setShowTemplates(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Note</h1>
          <p className="text-slate-600 dark:text-slate-300">
            {selectedTemplate 
              ? `Using template: ${selectedTemplate.name}` 
              : 'Start with a template or create from scratch'
            }
          </p>
        </div>
        
        {!selectedTemplate && (
          <button
            onClick={() => setShowTemplates(true)}
            className="btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Choose Template
          </button>
        )}
      </div>

      {/* Editor */}
      <EnhancedNoteEditor
        initial={{
          title: selectedTemplate?.name || '',
          content: selectedTemplate?.content || '',
          tags: selectedTemplate?.tags || [],
          reminder_at: null
        }}
        onSave={handleSave}
      />

      {/* Template Selector Modal */}
      {showTemplates && (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Floating Action Button for mobile quick access */}
      <FloatingActionButton />
    </div>
  )
}
