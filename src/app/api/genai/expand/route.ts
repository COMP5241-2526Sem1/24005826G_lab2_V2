import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { text } = await req.json()
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    // Fallback: append a heuristic expansion notice
    const expanded = String(text || '') + '\n\n[Expansion unavailable: set OPENAI_API_KEY]'
    return NextResponse.json({ expanded })
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
          { role: 'system', content: 'Expand the user note with helpful detail while staying on topic.' },
          { role: 'user', content: String(text || '') },
        ],
      }),
    })
    const data = await res.json()
    const expanded = data.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ expanded })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
