import { NextResponse } from 'next/server'
import { summarizeText } from '@/lib/manus'

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({})) as any
    const text = typeof payload.text === 'string' ? payload.text : ''
    
    if (!text.trim()) {
      return NextResponse.json({ error: 'Text is required for summarization.' }, { status: 400 })
    }

    const summary = await summarizeText(text)
    return NextResponse.json({ summary })
  } catch (e: any) {
    console.error('Manus AI summarize error:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to summarize text with Manus AI' 
    }, { status: 500 })
  }
}
