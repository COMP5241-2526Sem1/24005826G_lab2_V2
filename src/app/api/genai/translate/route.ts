import { NextResponse } from 'next/server'
import { cohereTranslate } from '@/lib/cohere'

export async function POST(req: Request) {
  try {
    const { text, target } = await req.json()
    const translated = await cohereTranslate(text, target)
    if (!translated) return NextResponse.json({ error: 'Cohere translation failed' }, { status: 500 })
    return NextResponse.json({ translated })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'GenAI error' }, { status: 500 })
  }
}
