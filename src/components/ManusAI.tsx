"use client"
import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Props {
  noteContent?: string
  onInsertContent?: (content: string) => void
  // new/alternate prop names used by other components
  currentContent?: string
  onContentInsert?: (text: string) => void
  onClose?: () => void
}

export function ManusAI({ noteContent, onInsertContent, currentContent, onContentInsert, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // If parent provided onClose/currentContent this component is being controlled
  // by the parent (they render/unrender or expect the assistant to open). In
  // that case, start open. Otherwise use internal open state.
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(onClose))

  async function sendMessage() {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const chatMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Add context about the current note if available. Support both the
      // legacy `noteContent` prop and the newer `currentContent` prop.
      const contextContent = (currentContent ?? noteContent) || ''
      if (contextContent.trim()) {
        chatMessages.unshift({
          role: 'user',
          content: `Context: I'm working on a note with the following content:\n\n${contextContent}\n\nPlease help me with: ${input}`
        })
      }

      const res = await fetch('/api/genai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', messages: chatMessages })
      })

      const data = await res.json()
      
      if (data.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else if (data.error) {
        alert('AI Error: ' + data.error)
      }
    } catch (error) {
      console.error('Chat error:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function clearChat() {
    setMessages([])
  }

  function insertResponse(content: string) {
    // Support both prop names for insertion callback
    const insertHandler = onContentInsert ?? onInsertContent
    if (insertHandler) {
      insertHandler(content)
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            // If parent controls visibility via onClose prop, don't attempt to
            // open internally — parent should mount/unmount this component.
            if (onClose) return
            setIsOpen(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-xl">🤖</span>
          <span className="font-medium">AI Assistant</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h3 className="font-semibold">Manus AI Assistant</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="text-white/80 hover:text-white text-sm px-2 py-1 rounded"
            title="Clear chat"
          >
            🗑️
          </button>
          <button
            onClick={() => {
              // If a parent onClose handler is provided, call it so the parent
              // can hide the assistant. Otherwise fall back to local state.
              if (onClose) {
                onClose()
              } else {
                setIsOpen(false)
              }
            }}
            className="text-white/80 hover:text-white text-lg px-2 py-1 rounded"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="mb-2">👋 Hi! I'm your AI assistant.</p>
            <p className="text-sm">Ask me anything about your notes or request help with writing, editing, or organizing your content.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.role === 'assistant' && onInsertContent && (
                <button
                  onClick={() => insertResponse(message.content)}
                  className="mt-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  Insert into note
                </button>
              )}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask AI anything..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-sm">Send</span>
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setInput('Help me brainstorm ideas for this note')}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            💡 Brainstorm
          </button>
          <button
            onClick={() => setInput('What questions should I explore about this topic?')}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ❓ Questions
          </button>
          <button
            onClick={() => setInput('Help me organize this content better')}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            📋 Organize
          </button>
        </div>
      </div>
    </div>
  )
}