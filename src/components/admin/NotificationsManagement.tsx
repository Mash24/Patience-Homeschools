'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCircle, Loader2 } from 'lucide-react'
import { getMyNotifications, markNotificationRead } from '@/lib/notifications/actions'

interface Notification {
  id: string
  recipient_id: string
  recipient_role?: string
  title: string
  body: string
  is_read: boolean
  created_at: string
}

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await getMyNotifications(100) as Notification[]
      setNotifications(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="h-10 w-10 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">Notifications</h1>
        <p className="text-sm text-ink-muted">System notifications sent to users across the platform</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: notifications.length },
          { label: 'Unread', count: notifications.filter((n) => !n.is_read).length },
          { label: 'Parents', count: notifications.filter((n) => n.recipient_role === 'parent').length },
          { label: 'Teachers', count: notifications.filter((n) => n.recipient_role === 'teacher').length },
        ].map((s) => (
          <div key={s.label} className="card-elevated p-4">
            <p className="text-xs text-ink-muted">{s.label}</p>
            <p className="text-xl font-bold text-ink">{s.count}</p>
          </div>
        ))}
      </div>

      <div className="card-elevated divide-y divide-ink/5">
        {notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-muted">No notifications logged yet.</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`p-4 flex items-start justify-between gap-4 ${!n.is_read ? 'bg-gold-50/30' : ''}`}>
              <div className="flex gap-3">
                <Bell className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ink">{n.title}</p>
                  <p className="text-sm text-ink-muted mt-1">{n.body}</p>
                  <p className="text-xs text-ink-muted/70 mt-2 capitalize">
                    {n.recipient_role} · {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {!n.is_read && (
                <button onClick={() => handleMarkRead(n.id)} className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1 shrink-0">
                  <CheckCircle className="h-3.5 w-3.5" /> Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
