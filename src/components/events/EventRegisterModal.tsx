'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { registerForEvent } from '@/lib/events/actions'

export default function EventRegisterModal({
  event,
  onClose,
}: {
  event: { id: string; title: string }
  onClose: () => void
}) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await registerForEvent({
        eventId: event.id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
      <div className="bg-white rounded-2xl shadow-luxury w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-ink-muted hover:text-ink">
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <h3 className="font-serif text-lg font-semibold text-ink mb-2">You&apos;re registered!</h3>
            <p className="text-sm text-ink-muted mb-6">
              We&apos;ve received your interest for <strong>{event.title}</strong>. Our team will be in touch.
            </p>
            <button onClick={onClose} className="btn-primary text-sm">Close</button>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-lg font-semibold text-ink mb-1">Register interest</h3>
            <p className="text-sm text-ink-muted mb-5">{event.title}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="input-field" placeholder="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input type="email" className="input-field" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input-field" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <textarea className="input-field min-h-[72px]" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={saving} className="btn-primary w-full text-sm">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Submit registration'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
