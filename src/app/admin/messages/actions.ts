'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function replyToThread(threadId: string, body: string) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Add message to thread
  const { error } = await supabase
    .from('messages')
    .insert({
      thread_id: threadId,
      sender_id: adminUser.id,
      sender_role: 'admin',
      body
    })
  
  if (error) throw new Error(error.message)

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'message',
    entity_id: threadId,
    action: 'reply'
  })

  revalidatePath('/admin/messages')
  return { success: true }
}

export async function closeThread(threadId: string) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Close thread
  const { error } = await supabase
    .from('message_threads')
    .update({ status: 'closed' })
    .eq('id', threadId)
  
  if (error) throw new Error(error.message)

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'message',
    entity_id: threadId,
    action: 'close_thread'
  })

  revalidatePath('/admin/messages')
  return { success: true }
}

export async function getMessageThreads(status?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('message_threads')
    .select(`
      *,
      messages(
        id,
        sender_id,
        sender_role,
        body,
        created_at
      )
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  
  if (error) throw new Error(error.message)
  return data
}

export async function getNotifications() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  
  if (error) throw new Error(error.message)
  return { success: true }
}
