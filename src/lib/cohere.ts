import fetch from 'node-fetch'

const COHERE_API_URL = 'https://api.cohere.ai/v1'
const COHERE_API_KEY = process.env.COHERE_API_KEY

export async function cohereSummarize(text: string) {
  const res = await fetch(`${COHERE_API_URL}/summarize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  })
  const data = await res.json()
  return data.summary || data.generations?.[0]?.text || null
}

export async function cohereGenerate(prompt: string) {
  const res = await fetch(`${COHERE_API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, max_tokens: 256 })
  })
  const data = await res.json()
  return data.generations?.[0]?.text || null
}

// Cohere does not have direct translation, but you can prompt it to translate
export async function cohereTranslate(text: string, target: string) {
  const prompt = `Translate this text to ${target}: ${text}`
  return await cohereGenerate(prompt)
}
