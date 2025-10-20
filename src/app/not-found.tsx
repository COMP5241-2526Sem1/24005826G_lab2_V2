export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto py-10 space-y-3">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-gray-500">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="underline">Go home</a>
    </div>
  )
}
