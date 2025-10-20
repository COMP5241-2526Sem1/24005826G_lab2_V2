export function keywords(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).filter(w => w.length > 2))
}

export function similarity(a: string, b: string): number {
  const A = keywords(a), B = keywords(b)
  const inter = new Set([...A].filter(x => B.has(x))).size
  const union = new Set([...A, ...B]).size
  return union ? inter / union : 0
}
