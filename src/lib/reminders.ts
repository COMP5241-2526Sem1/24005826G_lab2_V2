"use client"

export function scheduleReminder(reminderAtISO: string, title: string) {
  if (typeof window === 'undefined') return
  if (!('Notification' in window)) return
  const reminderAt = new Date(reminderAtISO).getTime()
  const delay = reminderAt - Date.now()
  if (delay <= 0) return
  Notification.requestPermission().then((perm) => {
    if (perm !== 'granted') return
    setTimeout(() => {
      new Notification('Note reminder', { body: title })
    }, Math.min(delay, 2 ** 31 - 1))
  })
}
