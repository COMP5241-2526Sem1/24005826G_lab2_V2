"use client"
import { useState } from 'react'

export function MarketLookup({ onInsert }: { onInsert: (text: string) => void }) {
  const [type, setType] = useState<'crypto'|'stock'>('crypto')
  const [symbol, setSymbol] = useState('bitcoin')
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState<string>('')

  async function fetchPrice() {
    setLoading(true)
    try {
      const res = await fetch(`/api/market?type=${type}&symbol=${encodeURIComponent(symbol)}`)
      const data = await res.json()
      if (type === 'crypto') {
        const usd = data?.data?.[symbol]?.usd
        setPrice(usd ? `$${usd}` : 'N/A')
      } else {
        const q = data?.data?.symbols?.[0]
        setPrice(q?.close ? `$${q.close}` : 'N/A')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="border rounded p-3 space-y-2 text-sm">
      <div className="font-medium">Market data</div>
      <div className="flex gap-2 items-center">
        <select className="border rounded px-2 py-1" value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="crypto">Crypto</option>
          <option value="stock">Stock</option>
        </select>
        <input className="border rounded px-2 py-1" placeholder={type==='crypto'?'bitcoin':'AAPL'} value={symbol} onChange={e=>setSymbol(e.target.value)} />
        <button className="border rounded px-2 py-1" onClick={fetchPrice} disabled={loading}>Lookup</button>
      </div>
      {price && (
        <div className="flex items-center gap-2">
          <div>Price: <span className="font-semibold">{price}</span></div>
          <button className="text-xs underline" onClick={()=> onInsert(`\n[${type.toUpperCase()} ${symbol}] Price: ${price}`)}>Insert into note</button>
        </div>
      )}
    </div>
  )
}
