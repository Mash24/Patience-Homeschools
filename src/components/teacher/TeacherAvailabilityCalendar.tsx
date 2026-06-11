'use client'

import { Clock } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const WEEKDAYS = new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
const WEEKENDS = new Set(['Sat', 'Sun'])

const SLOTS = [
  { key: 'mornings', label: 'Morning', time: '6am – 12pm', availabilityKey: 'mornings' },
  { key: 'afternoons', label: 'Afternoon', time: '12 – 5pm', availabilityKey: 'afternoons' },
  { key: 'evenings', label: 'Evening', time: '5 – 9pm', availabilityKey: 'evenings' },
] as const

interface Session {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  location?: string
  assignment?: { subject?: string; child?: { full_name?: string } }
}

function isAvailable(availability: string[], slotKey: string, day: string) {
  if (availability.includes('weekends') && WEEKENDS.has(day)) return true
  if (!WEEKDAYS.has(day)) return false
  return availability.includes(slotKey)
}

function formatTime(t: string) {
  const [h, m] = (t || '').split(':')
  const hour = parseInt(h, 10)
  if (Number.isNaN(hour)) return t
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m || '00'} ${ampm}`
}

export default function TeacherAvailabilityCalendar({
  availability,
  sessions,
}: {
  availability: string[]
  sessions: Session[]
}) {
  const sessionsByDay = DAYS.reduce<Record<string, Session[]>>((acc, day) => {
    acc[day] = sessions.filter((s) => s.day_of_week === day)
    return acc
  }, {} as Record<string, Session[]>)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gold-100 border border-gold-300" /> General availability
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-100 border border-green-300" /> Booked session
        </span>
      </div>

      <div className="card-elevated overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead>
            <tr className="border-b border-ink/5">
              <th className="p-3 text-left text-xs font-medium text-ink-muted w-28">Time</th>
              {DAYS.map((day) => (
                <th key={day} className="p-3 text-center text-xs font-medium text-ink-muted">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot.key} className="border-b border-ink/5 last:border-0">
                <td className="p-3 align-top">
                  <p className="font-medium text-ink text-xs">{slot.label}</p>
                  <p className="text-[10px] text-ink-muted">{slot.time}</p>
                </td>
                {DAYS.map((day) => {
                  const available = isAvailable(availability, slot.availabilityKey, day)
                  const daySessions = (sessionsByDay[day] || []).filter((s) => {
                    const hour = parseInt((s.start_time || '').split(':')[0], 10)
                    if (slot.key === 'mornings') return hour < 12
                    if (slot.key === 'afternoons') return hour >= 12 && hour < 17
                    return hour >= 17
                  })
                  return (
                    <td key={day} className="p-2 align-top min-w-[80px]">
                      <div
                        className={`min-h-[52px] rounded-lg p-1.5 space-y-1 ${
                          available ? 'bg-gold-50/80 border border-gold-100' : 'bg-ivory/50'
                        }`}
                      >
                        {daySessions.map((s) => (
                          <div
                            key={s.id}
                            className="bg-green-100 border border-green-200 rounded-md px-1.5 py-1 text-[10px] leading-tight text-green-900"
                          >
                            <p className="font-medium truncate">
                              {s.assignment?.subject || 'Session'}
                            </p>
                            <p className="text-green-700">
                              {formatTime(s.start_time)}–{formatTime(s.end_time)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
            {availability.includes('weekends') && (
              <tr>
                <td className="p-3 align-top">
                  <p className="font-medium text-ink text-xs">Weekends</p>
                  <p className="text-[10px] text-ink-muted">Sat & Sun</p>
                </td>
                {DAYS.map((day) => (
                  <td key={day} className="p-2 align-top">
                    {WEEKENDS.has(day) ? (
                      <div className="min-h-[40px] rounded-lg bg-gold-50/80 border border-gold-100 p-2">
                        {(sessionsByDay[day] || []).map((s) => (
                          <div
                            key={s.id}
                            className="bg-green-100 border border-green-200 rounded-md px-1.5 py-1 text-[10px] text-green-900 mb-1"
                          >
                            {s.assignment?.subject} · {formatTime(s.start_time)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="min-h-[40px] rounded-lg bg-ivory/30" />
                    )}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {availability.length === 0 && sessions.length === 0 && (
        <p className="text-sm text-ink-muted flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Set your availability in Profile to help admins match you with families.
        </p>
      )}
    </div>
  )
}
