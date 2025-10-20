import fetch from 'node-fetch'

const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2'
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export async function googleTranslate(text: string, target: string) {
  if (!text || !text.trim() || !target || !target.trim()) {
    throw new Error('Google Translate: text and target are required.')
  }
  if (!GOOGLE_TRANSLATE_API_KEY) {
    throw new Error('Google Translate: API key is not configured.')
  }

  const res = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      target: target.toLowerCase(),
      format: 'text',
    }),
  })

  const data = await res.json() as any
  if (!res.ok) {
    const message = data?.error?.message || 'Google Translate request failed.'
    throw new Error(message)
  }

  const translated = data?.data?.translations?.[0]?.translatedText
  if (!translated) {
    throw new Error('Google Translate: missing translated text in response.')
  }

  return decodeHtmlEntities(translated)
}
