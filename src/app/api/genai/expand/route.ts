import { NextResponse } from 'next/server'
import { cohereGenerate } from '@/lib/cohere'

export async function POST(req: Request) {
  const { text } = await req.json()
  const expanded = await cohereGenerate(`Expand this note with helpful detail while staying on topic: ${text}`)
  if (!expanded) return NextResponse.json({ error: 'Cohere expansion failed' }, { status: 500 })
  return NextResponse.json({ expanded })
}
