'use server'

import { createClient } from '@/lib/supabase-server'
import { supabaseServer } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'

export type MessageEmailMode = 'instant' | 'digest' | 'off'

export interface NotificationPrefs {
  email_messages: MessageEmailMode
}

const DEFAULT_PREFS: NotificationPrefs = { email_messages: 'instant' }

export async function getMyNotificationPreferences(): Promise<NotificationPrefs> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return DEFAULT_PREFS

  const { data } = await supabase
    .from('notification_preferences')
    .select('email_messages')
    .eq('user_id', user.id)
    .maybeSingle()

  return {
    email_messages: (data?.email_messages as MessageEmailMode) || 'instant',
  }
}

export async function updateMyNotificationPreferences(prefs: NotificationPrefs) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const mode = prefs.email_messages
  if (!['instant', 'digest', 'off'].includes(mode)) {
    throw new Error('Invalid email preference')
  }

  const { error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: user.id,
      email_messages: mode,
      updated_at: new Date().toISOString(),
    })

  if (error) throw new Error(error.message)

  revalidatePath('/parent/dashboard')
  revalidatePath('/teacher/dashboard')
  return { success: true }
}

export async function getUserMessageEmailMode(userId: string): Promise<MessageEmailMode> {
  const { data } = await supabaseServer
    .from('notification_preferences')
    .select('email_messages')
    .eq('user_id', userId)
    .maybeSingle()

  return (data?.email_messages as MessageEmailMode) || 'instant'
}

export async function queueMessageForDigest(data: {
  recipientId: string
  threadId: string
  subject: string
  preview: string
}) {
  await supabaseServer.from('message_digest_queue').insert({
    recipient_id: data.recipientId,
    thread_id: data.threadId,
    subject: data.subject,
    preview: data.preview,
  })
}
