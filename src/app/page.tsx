export default async function HomePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold">Notely</h1>
        <p className="text-gray-600 dark:text-gray-300">Create, tag, and translate notes with market data references.</p>
      </section>
      <div className="flex gap-3">
        <a href="/notes" className="px-4 py-2 rounded bg-blue-600 text-white">Go to Notes</a>
        <a href="/analytics" className="px-4 py-2 rounded border">View Analytics</a>
      </div>
    </div>
  )
}
