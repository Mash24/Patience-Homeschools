'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { createInAppNotification } from '@/lib/notifications/actions'
import { getUserMessageEmailMode, queueMessageForDigest } from '@/lib/notifications/preferences'
import { sendNewMessageEmail } from '@/lib/email'
import { supabaseServer } from '@/lib/supabaseServer'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  return { supabase, user, role }
}

export async function getMyThreads() {
  const { supabase, user, role } = await getAuthUser()

  if (role === 'admin') {
    const { data, error } = await supabase
      .from('message_threads')
      .select(`*, messages(id, sender_id, sender_role, body, created_at)`)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  }

  const select = `*, messages(id, sender_id, sender_role, body, created_at)`
  const [byCreator, byParent, byTeacher] = await Promise.all([
    supabase.from('message_threads').select(select).eq('created_by', user.id).order('created_at', { ascending: false }),
    supabase.from('message_threads').select(select).eq('context->>parent_id', user.id).order('created_at', { ascending: false }),
    supabase.from('message_threads').select(select).eq('context->>teacher_id', user.id).order('created_at', { ascending: false }),
  ])

  const merged = new Map<string, Record<string, unknown>>()
  for (const row of [...(byCreator.data || []), ...(byParent.data || []), ...(byTeacher.data || [])]) {
    merged.set(row.id as string, row as Record<string, unknown>)
  }
  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
  )
}

export async function getOrCreateAssignmentThread(assignmentId: string) {
  const { supabase, user, role } = await getAuthUser()

  const { data: assignment, error: aErr } = await supabase
    .from('assignments')
    .select('id, parent_id, teacher_id, subject')
    .eq('id', assignmentId)
    .single()

  if (aErr || !assignment) throw new Error('Assignment not found')

  const isParticipant =
    role === 'admin' ||
    assignment.parent_id === user.id ||
    assignment.teacher_id === user.id

  if (!isParticipant) throw new Error('Unauthorized')

  const { data: existing } = await supabase
    .from('message_threads')
    .select('*')
    .eq('context->>assignment_id', assignmentId)
    .maybeSingle()

  if (existing) return existing

  const { data: thread, error } = await supabase
    .from('message_threads')
    .insert({
      subject: `Re: ${assignment.subject || 'Tutoring'}`,
      created_by: user.id,
      context: {
        assignment_id: assignmentId,
        parent_id: assignment.parent_id,
        teacher_id: assignment.teacher_id,
      },
      status: 'open',
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return thread
}

export async function sendMessage(threadId: string, body: string) {
  const { supabase, user, role } = await getAuthUser()
  if (!body.trim()) throw new Error('Message cannot be empty')

  const { error } = await supabase.from('messages').insert({
    thread_id: threadId,
    sender_id: user.id,
    sender_role: role as 'admin' | 'teacher' | 'parent',
    body: body.trim(),
  })

  if (error) throw new Error(error.message)

  const { data: thread } = await supabase
    .from('message_threads')
    .select('subject, context')
    .eq('id', threadId)
    .single()

  const ctx = thread?.context as { parent_id?: string; teacher_id?: string } | undefined
  const recipientId =
    user.id === ctx?.parent_id ? ctx?.teacher_id
    : user.id === ctx?.teacher_id ? ctx?.parent_id
    : ctx?.parent_id || ctx?.teacher_id

  if (recipientId && recipientId !== user.id) {
    const recipientRole = user.id === ctx?.parent_id ? 'teacher' : 'parent'
    await createInAppNotification({
      recipientId,
      recipientRole: recipientRole as 'teacher' | 'parent',
      title: 'New message',
      body: thread?.subject ? `New message in: ${thread.subject}` : 'You have a new message',
    })

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', recipientId)
      .maybeSingle()

    const emailMode = await getUserMessageEmailMode(recipientId)
    if (emailMode === 'digest') {
      await queueMessageForDigest({
        recipientId,
        threadId,
        subject: thread?.subject || 'New message',
        preview: body.trim().slice(0, 120),
      }).catch(() => {})
    } else if (emailMode === 'instant') {
      const { data: authUser } = await supabaseServer.auth.admin.getUserById(recipientId)
      const email = authUser?.user?.email
      if (email) {
        await sendNewMessageEmail({
          to: email,
          recipientName: profile?.full_name || 'there',
          subject: thread?.subject || 'New message',
          preview: body.trim().slice(0, 120),
        }).catch(() => {})
      }
    }
  }

  revalidatePath('/admin/messages')
  return { success: true }
}

export async function adminReplyToThread(threadId: string, body: string) {
  return sendMessage(threadId, body)
}

export async function closeThread(threadId: string) {
  const { supabase, role } = await getAuthUser()
  if (role !== 'admin') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('message_threads')
    .update({ status: 'closed' })
    .eq('id', threadId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/messages')
  return { success: true }
}
