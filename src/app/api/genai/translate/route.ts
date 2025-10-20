import { NextResponse } from 'next/server'
import { translateText } from '@/lib/translationService'

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({})) as any
    const text = typeof payload.text === 'string' ? payload.text : ''
    const targetLanguage = typeof payload.targetLanguage === 'string' ? payload.targetLanguage : ''
    
    if (!text.trim()) {
      return NextResponse.json({ error: 'Text is required for translation.' }, { status: 400 })
    }
    if (!targetLanguage.trim()) {
      return NextResponse.json({ error: 'Target language is required for translation.' }, { status: 400 })
    }
    
    const translated = await translateText(text, targetLanguage)
    return NextResponse.json({ translated })
  } catch (e: any) {
    console.error('Translation error:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to translate text' 
    }, { status: 500 })
  }
}
