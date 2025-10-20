import { NextResponse } from 'next/server'
import { cohereSummarize } from '@/lib/cohere'

export async function POST(req: Request) {
  const { text } = await req.json()
  const summary = await cohereSummarize(text)
  if (!summary) return NextResponse.json({ error: 'Cohere summarization failed' }, { status: 500 })
  return NextResponse.json({ summary })
}
