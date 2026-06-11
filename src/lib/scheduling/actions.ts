'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { createInAppNotification } from '@/lib/notifications/actions'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export async function createClassSession(data: {
  assignmentId: string
  dayOfWeek: string
  startTime: string
  endTime: string
  location?: string
  notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  if (!DAYS.includes(data.dayOfWeek as typeof DAYS[number])) {
    throw new Error('Invalid day of week')
  }

  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, teacher_id, parent_id, subject')
    .eq('id', data.assignmentId)
    .single()

  if (!assignment) throw new Error('Assignment not found')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin' && assignment.teacher_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { data: session, error } = await supabase
    .from('class_sessions')
    .insert({
      assignment_id: data.assignmentId,
      day_of_week: data.dayOfWeek,
      start_time: data.startTime,
      end_time: data.endTime,
      location: data.location || null,
      notes: data.notes || null,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  if (assignment.parent_id) {
    await createInAppNotification({
      recipientId: assignment.parent_id,
      recipientRole: 'parent',
      title: 'Schedule updated',
      body: `A new session was added for ${assignment.subject || 'tutoring'} on ${data.dayOfWeek}.`,
    })
  }

  revalidatePath('/teacher/dashboard')
  revalidatePath('/parent/dashboard')
  return session
}

export async function deleteClassSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: session } = await supabase
    .from('class_sessions')
    .select('assignment_id')
    .eq('id', sessionId)
    .single()

  if (!session) throw new Error('Session not found')

  const { data: assignment } = await supabase
    .from('assignments')
    .select('teacher_id')
    .eq('id', session.assignment_id)
    .single()

  const teacherId = assignment?.teacher_id
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string

  if (role !== 'admin' && teacherId !== user.id) throw new Error('Unauthorized')

  const { error } = await supabase.from('class_sessions').delete().eq('id', sessionId)
  if (error) throw new Error(error.message)

  revalidatePath('/teacher/dashboard')
  revalidatePath('/parent/dashboard')
  return { success: true }
}

export async function logSession(data: {
  assignmentId: string
  sessionDate: string
  startTime: string
  endTime: string
  notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: assignment } = await supabase
    .from('assignments')
    .select('teacher_id, parent_id, subject')
    .eq('id', data.assignmentId)
    .single()

  if (!assignment) throw new Error('Assignment not found')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin' && assignment.teacher_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('session_logs').insert({
    assignment_id: data.assignmentId,
    session_date: data.sessionDate,
    start_time: data.startTime,
    end_time: data.endTime,
    notes: data.notes || null,
  })

  if (error) throw new Error(error.message)

  if (assignment.parent_id) {
    await createInAppNotification({
      recipientId: assignment.parent_id,
      recipientRole: 'parent',
      title: 'Session logged',
      body: `Your tutor logged a session for ${assignment.subject || 'tutoring'} on ${data.sessionDate}.`,
    })
  }

  revalidatePath('/teacher/dashboard')
  revalidatePath('/parent/dashboard')
  return { success: true }
}

export async function getSessionLogs(assignmentIds: string[]) {
  if (!assignmentIds.length) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('session_logs')
    .select('*')
    .in('assignment_id', assignmentIds)
    .order('session_date', { ascending: false })
    .limit(50)

  if (error) throw new Error(error.message)
  return data || []
}
