'use client'

import { useState } from 'react'
import { Calendar, Plus, Trash2, Loader2 } from 'lucide-react'
import { createClassSession, deleteClassSession } from '@/lib/scheduling/actions'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Session {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  location?: string
  notes?: string
}

interface Assignment {
  id: string
  subject?: string
}

export default function ScheduleManager({
  assignments,
  sessions,
  readOnly = false,
  onUpdated,
}: {
  assignments: Assignment[]
  sessions: Session[]
  readOnly?: boolean
  onUpdated: () => void
}) {
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]?.id || '')
  const [form, setForm] = useState({ day: 'Mon', start: '09:00', end: '10:00', location: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!selectedAssignment) return
    setSaving(true)
    try {
      await createClassSession({
        assignmentId: selectedAssignment,
        dayOfWeek: form.day,
        startTime: form.start,
        endTime: form.end,
        location: form.location || undefined,
        notes: form.notes || undefined,
      })
      setForm({ day: 'Mon', start: '09:00', end: '10:00', location: '', notes: '' })
      onUpdated()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to add session')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this session?')) return
    try {
      await deleteClassSession(id)
      onUpdated()
    } catch {
      alert('Failed to delete session')
    }
  }

  return (
    <div className="space-y-6">
      {!readOnly && assignments.length > 0 && (
        <div className="card-elevated p-5 space-y-4">
          <h3 className="font-medium text-ink flex items-center gap-2">
            <Plus className="h-4 w-4 text-gold-600" /> Add weekly session
          </h3>
          <select
            className="input-field"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>{a.subject || 'Tutoring'}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select className="input-field" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" className="input-field" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            <input type="time" className="input-field" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            <input className="input-field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <button onClick={handleAdd} disabled={saving} className="btn-primary text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add session'}
          </button>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="card-elevated p-8 text-center text-ink-muted text-sm">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
          No sessions scheduled yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="card-elevated p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{s.day_of_week} · {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}</p>
                {s.location && <p className="text-xs text-ink-muted mt-1">{s.location}</p>}
              </div>
              {!readOnly && (
                <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
