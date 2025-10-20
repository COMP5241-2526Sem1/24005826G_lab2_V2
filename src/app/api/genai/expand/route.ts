import { NextResponse } from 'next/server'
import { expandText } from '@/lib/manus'

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({})) as any
    const text = typeof payload.text === 'string' ? payload.text : ''
    
    if (!text.trim()) {
      return NextResponse.json({ error: 'Text is required for expansion.' }, { status: 400 })
    }

    const expanded = await expandText(text)
    return NextResponse.json({ expanded })
  } catch (e: any) {
    console.error('Manus AI expand error:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to expand text with Manus AI' 
    }, { status: 500 })
  }
}
