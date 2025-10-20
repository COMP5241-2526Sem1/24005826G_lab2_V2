import fetch from 'node-fetch'

const COHERE_API_URL = 'https://api.cohere.ai/v1'
const COHERE_API_KEY = process.env.COHERE_API_KEY
const COHERE_MODEL = process.env.COHERE_MODEL || 'command'

function extractCohereText(data: any): string | null {
  // New Chat API may return one of these shapes
  if (!data) return null
  if (typeof data.text === 'string' && data.text.trim()) return data.text
  if (data.response && typeof data.response.text === 'string') return data.response.text
  if (Array.isArray(data.messages)) {
    const last = data.messages[data.messages.length - 1]
    if (last?.content) {
      const parts = Array.isArray(last.content) ? last.content : [last.content]
      const txt = parts.map((p: any) => p.text || '').join('')
      if (txt.trim()) return txt
    }
  }
  if (Array.isArray(data.generations) && data.generations[0]?.text) return data.generations[0].text
  return null
}

async function cohereChat(message: string): Promise<string | null> {
  const res = await fetch(`${COHERE_API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_MODEL,
      message,
      temperature: 0.3,
    }),
  })
  const data = (await res.json()) as any
  if (!res.ok) {
    const msg = data?.message || data?.error || 'Cohere chat error'
    throw new Error(msg)
  }
  return extractCohereText(data)
}

export async function cohereSummarize(text: string) {
  // Try summarize endpoint first; if it fails (or removed), fall back to chat
  try {
    const res = await fetch(`${COHERE_API_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, model: COHERE_MODEL })
    })
    const data = (await res.json()) as any
    if (res.ok && data.summary) return data.summary
  } catch (_) {
    // fall through to chat
  }
  return await cohereChat(`Summarize concisely:\n\n${text}`)
}

export async function cohereGenerate(prompt: string) {
  // Migrate from deprecated /generate to Chat API
  return await cohereChat(prompt)
}

// Cohere does not have direct translation API; prompt the chat model
export async function cohereTranslate(text: string, target: string) {
  return await cohereChat(`Translate this text to ${target}. Only return the translation, no extra text.\n\n${text}`)
}
