import { NextResponse } from 'next/server'
import { cohereGenerate } from '@/lib/cohere'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    const expanded = await cohereGenerate(`Expand this note with helpful detail while staying on topic: ${text}`)
    if (!expanded) return NextResponse.json({ error: 'Cohere expansion failed' }, { status: 500 })
    return NextResponse.json({ expanded })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'GenAI error' }, { status: 500 })
  }
}
