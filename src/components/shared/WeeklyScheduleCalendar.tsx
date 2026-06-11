'use client'

import { Calendar } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export interface ScheduleSession {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  location?: string
  assignment?: {
    subject?: string
    teacher?: { full_name?: string; name?: string }
    child?: { full_name?: string }
  }
}

function formatTime(t: string) {
  const [h, m] = (t || '').split(':')
  const hour = parseInt(h, 10)
  if (Number.isNaN(hour)) return t
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m || '00'} ${ampm}`
}

function teacherName(s: ScheduleSession) {
  return s.assignment?.teacher?.full_name || s.assignment?.teacher?.name || 'Tutor'
}

export default function WeeklyScheduleCalendar({
  sessions,
  emptyMessage = 'No sessions scheduled yet.',
}: {
  sessions: ScheduleSession[]
  emptyMessage?: string
}) {
  const byDay = DAYS.reduce<Record<string, ScheduleSession[]>>((acc, day) => {
    acc[day] = sessions
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
    return acc
  }, {} as Record<string, ScheduleSession[]>)

  const totalSessions = sessions.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {totalSessions} session{totalSessions === 1 ? '' : 's'} per week
        </p>
      </div>

      {totalSessions === 0 ? (
        <div className="card-elevated p-8 text-center text-sm text-ink-muted">
          <Calendar className="h-10 w-10 mx-auto mb-3 text-ink-muted/40" />
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {DAYS.map((day) => (
            <div key={day} className="card-elevated p-3 min-h-[120px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700 mb-2">{day}</p>
              {byDay[day].length === 0 ? (
                <p className="text-[11px] text-ink-muted/60">—</p>
              ) : (
                <div className="space-y-2">
                  {byDay[day].map((s) => (
                    <div
                      key={s.id}
                      className="bg-gold-50 border border-gold-100 rounded-lg p-2 text-[11px] leading-snug"
                    >
                      <p className="font-semibold text-ink">
                        {formatTime(s.start_time)} – {formatTime(s.end_time)}
                      </p>
                      <p className="text-ink mt-0.5">{s.assignment?.subject || 'Tutoring'}</p>
                      <p className="text-ink-muted">{teacherName(s)}</p>
                      {s.location && <p className="text-ink-muted/80 mt-0.5">{s.location}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
