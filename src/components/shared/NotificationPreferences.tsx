'use client'

import { useEffect, useState } from 'react'
import { Bell, Loader2, Save } from 'lucide-react'
import {
  getMyNotificationPreferences,
  updateMyNotificationPreferences,
  type MessageEmailMode,
} from '@/lib/notifications/preferences'

const OPTIONS: { value: MessageEmailMode; label: string; description: string }[] = [
  {
    value: 'instant',
    label: 'Instant email',
    description: 'Get an email each time you receive a new message.',
  },
  {
    value: 'digest',
    label: 'Daily digest',
    description: 'One summary email per day instead of each message. In-app notifications still arrive immediately.',
  },
  {
    value: 'off',
    label: 'In-app only',
    description: 'No message emails — check your portal for new messages.',
  },
]

export default function NotificationPreferences() {
  const [mode, setMode] = useState<MessageEmailMode>('instant')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getMyNotificationPreferences()
      .then((p) => setMode(p.email_messages))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateMyNotificationPreferences({ email_messages: mode })
      setSaved(true)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not save preferences')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card-elevated p-6 flex items-center gap-2 text-sm text-ink-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading preferences...
      </div>
    )
  }

  return (
    <div className="card-elevated p-6 space-y-4 max-w-lg">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-gold-600" />
        <h3 className="font-medium text-ink">Message notifications</h3>
      </div>
      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              mode === opt.value ? 'border-gold-400 bg-gold-50/50' : 'border-ink/10 hover:bg-ivory'
            }`}
          >
            <input
              type="radio"
              name="email_messages"
              value={opt.value}
              checked={mode === opt.value}
              onChange={() => setMode(opt.value)}
              className="mt-1 text-gold-600 focus:ring-gold-500/30"
            />
            <div>
              <p className="text-sm font-medium text-ink">{opt.label}</p>
              <p className="text-xs text-ink-muted mt-0.5">{opt.description}</p>
            </div>
          </label>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? 'Saving...' : 'Save preferences'}
      </button>
      {saved && <p className="text-xs text-green-700">Preferences saved.</p>}
    </div>
  )
}
