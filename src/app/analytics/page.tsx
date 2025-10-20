import { supabasePublic } from '@/lib/supabasePublic'

export default async function AnalyticsPage() {
  const supabase = supabasePublic()
  const { data: notes } = await supabase.from('notes').select('id, created_at, tags')
  const count = notes?.length ?? 0
  const dayCounts = new Map<string, number>()
  notes?.forEach(n => {
    const d = new Date(n.created_at).toISOString().slice(0,10)
    dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1)
  })
  const topDays = Array.from(dayCounts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">Total notes</div>
          <div className="text-2xl font-semibold">{count}</div>
        </div>
        <div className="border rounded p-3 sm:col-span-2">
          <div className="text-sm text-gray-500">Most active days</div>
          <ul className="text-sm mt-1">
            {topDays.map(([d, c]) => (
              <li key={d} className="flex justify-between"><span>{d}</span><span className="font-medium">{c}</span></li>
            ))}
            {topDays.length === 0 && <li>—</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
