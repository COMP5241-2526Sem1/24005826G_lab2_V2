export default function Loading() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-900 rounded" />
        ))}
      </div>
    </div>
  )
}
