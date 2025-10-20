import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // crypto|stock
  const symbol = searchParams.get('symbol') || ''
  try {
    if (type === 'crypto') {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=usd`, { next: { revalidate: 60 } })
      const data = await res.json()
      return NextResponse.json({ data })
    }
    if (type === 'stock') {
      const res = await fetch(`https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=json`, { next: { revalidate: 60 } })
      const data = await res.json()
      return NextResponse.json({ data })
    }
    return NextResponse.json({ error: 'Unsupported type' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
