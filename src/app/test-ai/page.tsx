"use client"
import { useState } from 'react'

export default function TestAIPage() {
  const [content, setContent] = useState('This is a sample text about artificial intelligence and machine learning. AI has revolutionized many industries including healthcare, finance, and technology.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function testSummarize() {
    setLoading(true)
    try {
      const res = await fetch('/api/genai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content })
      })
      const data = await res.json()
      setResult(data.summary || data.error || 'No response')
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  async function testExpand() {
    setLoading(true)
    try {
      const res = await fetch('/api/genai/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content })
      })
      const data = await res.json()
      setResult(data.expanded || data.error || 'No response')
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  async function testImprove() {
    setLoading(true)
    try {
      const res = await fetch('/api/genai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improve', text: content })
      })
      const data = await res.json()
      setResult(data.improved || data.error || 'No response')
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  async function testTags() {
    setLoading(true)
    try {
      const res = await fetch('/api/genai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tags', text: content })
      })
      const data = await res.json()
      setResult(JSON.stringify(data.tags) || data.error || 'No response')
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  function replaceContent() {
    if (result) {
      setContent(result)
      setResult('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Features Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Original Text:</label>
          <textarea
            className="w-full h-32 border border-gray-300 rounded-lg p-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your text here..."
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={testSummarize}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            📝 Summarize
          </button>
          <button
            onClick={testExpand}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            📈 Expand
          </button>
          <button
            onClick={testImprove}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            ✨ Improve
          </button>
          <button
            onClick={testTags}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            🏷️ Generate Tags
          </button>
        </div>

        {loading && (
          <div className="text-blue-600">Processing with AI...</div>
        )}

        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">AI Result:</label>
            <div className="p-4 bg-gray-50 border rounded-lg">
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
            <button
              onClick={replaceContent}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Replace Original Text with This Result
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">How it works:</h3>
        <ol className="mt-2 text-sm text-yellow-700 list-decimal list-inside space-y-1">
          <li>Type your text in the textarea above</li>
          <li>Click any AI feature button (Summarize, Expand, Improve, Generate Tags)</li>
          <li>The AI will process your text and show the result</li>
          <li>Click "Replace Original Text" to update your content with the AI result</li>
          <li>This is exactly how it works in the note editor!</li>
        </ol>
      </div>
    </div>
  )
}