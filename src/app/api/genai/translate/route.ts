import { NextResponse } from 'next/server'
import { cohereTranslate } from '@/lib/cohere'

export async function POST(req: Request) {
  const { text, target } = await req.json()
  const translated = await cohereTranslate(text, target)
  if (!translated) return NextResponse.json({ error: 'Cohere translation failed' }, { status: 500 })
  return NextResponse.json({ translated })
}
