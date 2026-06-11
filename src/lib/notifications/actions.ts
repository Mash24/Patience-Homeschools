'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getMyNotifications(limit = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined

  let query = supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (role !== 'admin') {
    query = query.eq('recipient_id', user.id)
  }

  const { data, error } = await query
  if (error) {
    console.error('getMyNotifications:', error.message)
    return []
  }
  return data || []
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/notifications')
  return { success: true }
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', user.id)
    .eq('is_read', false)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function createInAppNotification(data: {
  recipientId: string
  recipientRole: 'admin' | 'teacher' | 'parent'
  title: string
  body: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('notifications').insert({
    recipient_id: data.recipientId,
    recipient_role: data.recipientRole,
    title: data.title,
    body: data.body,
    is_read: false,
  })
  if (error) console.error('createInAppNotification:', error.message)
}
