import { NextResponse } from 'next/server'
import { googleTranslate } from '@/lib/googleTranslate'

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({})) as any
    const text = typeof payload.text === 'string' ? payload.text : ''
    const target = typeof payload.target === 'string' ? payload.target : ''
    if (!text.trim()) {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 })
    }
    if (!target.trim()) {
      return NextResponse.json({ error: 'Target language is required.' }, { status: 400 })
    }
    const translated = await googleTranslate(text, target)
    return NextResponse.json({ translated })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'GenAI error' }, { status: 500 })
  }
}
