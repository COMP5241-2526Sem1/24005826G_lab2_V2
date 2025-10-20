"use client"
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-lg mx-auto py-10 space-y-3">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <pre className="p-3 border rounded text-xs whitespace-pre-wrap">{error.message}</pre>
      <button className="px-3 py-2 rounded border" onClick={() => reset()}>Try again</button>
    </div>
  )
}
