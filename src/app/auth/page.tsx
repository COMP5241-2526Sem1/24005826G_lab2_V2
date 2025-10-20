"use client"
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function AuthPage() {
  const supabase = supabaseBrowser()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-gray-500">Use magic link or OAuth if configured in Supabase.</p>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded border"
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin } })
            if (error) alert(error.message)
          }}
        >
          Continue with Google
        </button>
        <button
          className="px-3 py-2 rounded border"
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: location.origin } })
            if (error) alert(error.message)
          }}
        >
          Continue with GitHub
        </button>
      </div>
      {sent ? (
        <div className="p-3 border rounded text-sm">Check your email for the sign-in link.</div>
      ) : (
        <form className="space-y-3" onSubmit={async (e) => {
          e.preventDefault()
          const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin } })
          if (!error) setSent(true)
          else alert(error.message)
        }}>
          <input
            className="w-full border rounded px-3 py-2"
            type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
          />
          <button className="px-4 py-2 rounded bg-blue-600 text-white" type="submit">Send magic link</button>
        </form>
      )}
    </div>
  )
}
