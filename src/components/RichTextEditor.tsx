'use client'

import { useState, useRef, useCallback } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + before.length + selectedText.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }, [value, onChange])

  const formatCommands = [
    {
      name: 'Bold',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
      ),
      action: () => insertText('**', '**'),
      shortcut: 'Ctrl+B',
    },
    {
      name: 'Italic',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4l4 16" />
        </svg>
      ),
      action: () => insertText('*', '*'),
      shortcut: 'Ctrl+I',
    },
    {
      name: 'Heading',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10M7 3h10M7 12h10M12 3v18" />
        </svg>
      ),
      action: () => insertText('\n## ', '\n'),
      shortcut: 'Ctrl+H',
    },
    {
      name: 'Code',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      action: () => insertText('`', '`'),
      shortcut: 'Ctrl+`',
    },
    {
      name: 'Link',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      action: () => insertText('[', '](url)'),
      shortcut: 'Ctrl+K',
    },
    {
      name: 'List',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      action: () => insertText('\n- ', '\n'),
      shortcut: 'Ctrl+L',
    },
    {
      name: 'Quote',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      action: () => insertText('\n> ', '\n'),
      shortcut: 'Ctrl+Q',
    },
  ]

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertText('**', '**')
          break
        case 'i':
          e.preventDefault()
          insertText('*', '*')
          break
        case 'h':
          e.preventDefault()
          insertText('\n## ', '\n')
          break
        case '`':
          e.preventDefault()
          insertText('`', '`')
          break
        case 'k':
          e.preventDefault()
          insertText('[', '](url)')
          break
        case 'l':
          e.preventDefault()
          insertText('\n- ', '\n')
          break
        case 'q':
          e.preventDefault()
          insertText('\n> ', '\n')
          break
      }
    }

    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      insertText('  ')
    }
  }, [insertText])

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-200">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.*$)/gim, '<li class="text-slate-700 dark:text-slate-300 ml-4">• $1</li>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-200 dark:border-blue-800 pl-4 text-slate-600 dark:text-slate-400 italic">$1</blockquote>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-1">
          {formatCommands.map((command) => (
            <button
              key={command.name}
              onClick={command.action}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              title={`${command.name} (${command.shortcut})`}
            >
              {command.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded p-1">
            <button
              onClick={() => setIsPreview(false)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                !isPreview
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                isPreview
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {isPreview ? (
          <div
            className="input-field min-h-[400px] prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value || 'Nothing to preview yet...') }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-field min-h-[400px] resize-y font-mono text-sm leading-relaxed"
            placeholder={placeholder || 'Start writing... Use markdown for formatting'}
          />
        )}
      </div>

      {/* Markdown Guide */}
      <details className="text-xs text-slate-500 dark:text-slate-400">
        <summary className="cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
          Markdown Guide
        </summary>
        <div className="mt-2 space-y-1 bg-slate-50 dark:bg-slate-800 p-3 rounded">
          <div><code># Heading 1</code> • <code>## Heading 2</code> • <code>### Heading 3</code></div>
          <div><code>**bold**</code> • <code>*italic*</code> • <code>`code`</code></div>
          <div><code>[link](url)</code> • <code>- list item</code> • <code>&gt; quote</code></div>
        </div>
      </details>
    </div>
  )
}