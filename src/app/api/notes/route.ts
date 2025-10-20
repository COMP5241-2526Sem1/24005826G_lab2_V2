import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabasePublic'

export async function POST(req: Request) {
  try {
    const { title, content, tags, reminder_at } = await req.json()
    const supabase = supabasePublic()
    const { data, error } = await supabase
      .from('notes')
      .insert({ title, content, tags, reminder_at })
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data!.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create note' }, { status: 500 })
  }
}
