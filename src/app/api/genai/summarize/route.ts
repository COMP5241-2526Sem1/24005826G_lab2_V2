import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Summarize feature has been removed.' }, { status: 410 })
}
