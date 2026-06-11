'use server'

import { supabaseServer } from '@/lib/supabaseServer'
import { sendSessionReminderEmail } from '@/lib/email'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return {
    day: DAY_NAMES[d.getDay()],
    date: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' }),
  }
}

function formatTime(t: string) {
  const [h, m] = t.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export async function processSessionReminders() {
  const { day, date, label } = getTomorrow()

  const { data: sessions, error } = await supabaseServer
    .from('class_sessions')
    .select(`
      id, day_of_week, start_time, end_time, location,
      assignment:assignments(id, subject, status, parent_id, teacher_id)
    `)
    .eq('day_of_week', day)

  if (error) throw new Error(error.message)

  const activeSessions = (sessions || []).filter((s) => {
    const a = s.assignment as { status?: string } | null
    return a?.status === 'active'
  })

  if (!activeSessions.length) return { sent: 0 }

  const { data: alreadySent } = await supabaseServer
    .from('session_reminder_log')
    .select('class_session_id')
    .eq('reminder_date', date)
    .in('class_session_id', activeSessions.map((s) => s.id))

  const sentIds = new Set((alreadySent || []).map((r) => r.class_session_id))
  let sent = 0

  for (const session of activeSessions) {
    if (sentIds.has(session.id)) continue

    const assignment = session.assignment as {
      id: string
      subject?: string
      parent_id?: string
      teacher_id?: string
    }

    const subject = assignment?.subject || 'Tutoring'
    const timeLabel = `${formatTime(session.start_time)} – ${formatTime(session.end_time)}`
    const location = session.location || 'As scheduled'
    const body = `${subject} on ${label} at ${timeLabel}${session.location ? ` · ${location}` : ''}`

    const recipients: { id: string; role: 'parent' | 'teacher' }[] = []
    if (assignment?.parent_id) recipients.push({ id: assignment.parent_id, role: 'parent' })
    if (assignment?.teacher_id) recipients.push({ id: assignment.teacher_id, role: 'teacher' })

    for (const { id, role } of recipients) {
      await supabaseServer.from('notifications').insert({
        recipient_id: id,
        recipient_role: role,
        title: 'Session tomorrow',
        body,
        is_read: false,
      })

      const { data: authUser } = await supabaseServer.auth.admin.getUserById(id)
      const email = authUser?.user?.email
      if (email) {
        const { data: profile } = await supabaseServer
          .from('profiles')
          .select('full_name')
          .eq('id', id)
          .maybeSingle()

        await sendSessionReminderEmail({
          to: email,
          recipientName: profile?.full_name || 'there',
          subject,
          dateLabel: label,
          timeLabel,
          location,
        }).catch(() => {})
      }
    }

    await supabaseServer.from('session_reminder_log').insert({
      class_session_id: session.id,
      reminder_date: date,
    })

    sent += 1
  }

  return { sent }
}
