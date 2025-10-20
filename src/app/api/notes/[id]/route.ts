import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabasePublic'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, tags, reminder_at } = await req.json()
    const supabase = supabasePublic()
    const { error } = await supabase
      .from('notes')
      .update({ title, content, tags, reminder_at })
      .eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabasePublic()
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete note' }, { status: 500 })
  }
}
