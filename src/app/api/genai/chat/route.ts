import { NextResponse } from 'next/server'
import { chatWithAI, improveText, generateTags, suggestTitle } from '@/lib/manus'

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({})) as any
    const { messages, action, text, instructions } = payload

    if (action === 'improve' && text) {
      const improved = await improveText(text, instructions)
      return NextResponse.json({ improved })
    }

    if (action === 'tags' && text) {
      const tags = await generateTags(text)
      return NextResponse.json({ tags })
    }

    if (action === 'title' && text) {
      const title = await suggestTitle(text)
      return NextResponse.json({ title })
    }

    if (action === 'chat' && messages && Array.isArray(messages)) {
      const response = await chatWithAI(messages)
      return NextResponse.json({ response })
    }

    return NextResponse.json({ error: 'Invalid action or missing required parameters.' }, { status: 400 })
  } catch (e: any) {
    console.error('Manus AI chat error:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to process request with Manus AI' 
    }, { status: 500 })
  }
}