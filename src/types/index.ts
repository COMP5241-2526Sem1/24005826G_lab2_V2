export type Note = {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  language: string | null
  reminder_at: string | null
  created_at: string
  updated_at: string
  archived: boolean
  market_refs?: { type: 'stock' | 'crypto' | 'product'; symbol?: string; id?: string; url?: string }[] | null
}
