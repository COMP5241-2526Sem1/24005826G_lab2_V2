import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { text, target } = await req.json()
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    // Fallback: pass-through
    return NextResponse.json({ translated: String(text || '') })
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `Translate the user text into ${target || 'en'}. Only return the translation.` },
          { role: 'user', content: String(text || '') },
        ],
      }),
    })
    const data = await res.json()
    const translated = data.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ translated })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
