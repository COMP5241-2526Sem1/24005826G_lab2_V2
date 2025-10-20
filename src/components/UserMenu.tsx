import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function UserMenu() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  async function signOut() {
    'use server'
    const supabase = supabaseServer()
    await supabase.auth.signOut()
  }

  if (!user) {
    return <Link href="/auth" className="text-sm underline">Sign in</Link>
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 hidden sm:inline">{user.email}</span>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Server Action */}
      <form action={signOut}><button type="submit" className="border rounded px-2 py-1">Sign out</button></form>
    </div>
  )
}
