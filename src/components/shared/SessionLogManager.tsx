'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Plus, Loader2 } from 'lucide-react'
import { logSession, getSessionLogs } from '@/lib/scheduling/actions'

interface Log {
  id: string
  session_date: string
  start_time: string
  end_time: string
  notes?: string
  assignment_id: string
}

export default function SessionLogManager({
  assignments,
  readOnly = false,
}: {
  assignments: { id: string; subject?: string }[]
  readOnly?: boolean
}) {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]?.id || '')
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    start: '09:00',
    end: '10:00',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  const loadLogs = async () => {
    if (assignments.length === 0) {
      setLogs([])
      setLoading(false)
      return
    }
    try {
      const data = await getSessionLogs(assignments.map((a) => a.id))
      setLogs(data as Log[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [assignments.map((a) => a.id).join(',')])

  const handleLog = async () => {
    if (!selectedAssignment) return
    setSaving(true)
    try {
      await logSession({
        assignmentId: selectedAssignment,
        sessionDate: form.date,
        startTime: form.start,
        endTime: form.end,
        notes: form.notes || undefined,
      })
      setForm({ date: new Date().toISOString().slice(0, 10), start: '09:00', end: '10:00', notes: '' })
      await loadLogs()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to log session')
    } finally {
      setSaving(false)
    }
  }

  if (assignments.length === 0) {
    return (
      <div className="card-elevated p-8 text-center text-sm text-ink-muted">
        Attendance logs appear once you have active assignments.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-ink flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-gold-600" /> Session attendance
      </h3>

      {!readOnly && (
        <div className="card-elevated p-5 space-y-3">
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
            <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input type="time" className="input-field" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            <input type="time" className="input-field" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            <input className="input-field" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button onClick={handleLog} disabled={saving} className="btn-primary text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Log session</>}
          </button>
        </div>
      )}

      {logs.length === 0 ? (
        <p className="text-sm text-ink-muted">No sessions logged yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="card-elevated p-4 text-sm">
              <p className="font-medium text-ink">
                {new Date(log.session_date).toLocaleDateString()} · {log.start_time?.slice(0, 5)} – {log.end_time?.slice(0, 5)}
              </p>
              {log.notes && <p className="text-ink-muted mt-1">{log.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
