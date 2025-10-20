import { NextResponse } from 'next/server'
import { cohereSummarize } from '@/lib/cohere'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    const summary = await cohereSummarize(text)
    if (!summary) return NextResponse.json({ error: 'Cohere summarization failed' }, { status: 500 })
    return NextResponse.json({ summary })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'GenAI error' }, { status: 500 })
  }
}
