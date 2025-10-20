import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { text } = await req.json()
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    // Simple heuristic fallback: first 200 chars
    const summary = String(text || '').trim().slice(0, 200)
    return NextResponse.json({ summary })
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
          { role: 'system', content: 'Summarize the user note concisely.' },
          { role: 'user', content: String(text || '') },
        ],
      }),
    })
    const data = await res.json()
    const summary = data.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ summary })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
