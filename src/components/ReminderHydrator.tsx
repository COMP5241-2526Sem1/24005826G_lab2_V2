"use client"
import { useEffect } from 'react'
import { scheduleReminder } from '@/lib/reminders'

type NoteLike = { id: string; title?: string | null; reminder_at?: string | null }

export function ReminderHydrator({ notes }: { notes: NoteLike[] }) {
  useEffect(() => {
    notes.forEach(n => {
      if (n.reminder_at) scheduleReminder(n.reminder_at, n.title || 'Note')
    })
  }, [notes])
  return null
}
