'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'admin') throw new Error('Unauthorized')

  return { supabase, adminId: user.id }
}

export async function getAdminActions(limit = 25) {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('admin_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data || []
}

export async function getPlatformUsers() {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, phone, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw new Error(error.message)
  return data || []
}

export async function getEvents() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getResources() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function upsertEvent(data: {
  id?: string
  title: string
  description?: string
  event_type?: string
  date: string
  location?: string
  max_attendees?: number
  status?: string
}) {
  const { supabase } = await requireAdmin()

  const row = {
    title: data.title,
    description: data.description || null,
    event_type: data.event_type || 'workshop',
    date: data.date,
    location: data.location || null,
    max_attendees: data.max_attendees || null,
    status: data.status || 'published',
  }

  if (data.id) {
    const { error } = await supabase.from('events').update(row).eq('id', data.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('events').insert(row)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/content')
  return { success: true }
}

export async function upsertResource(data: {
  id?: string
  title: string
  description?: string
  category?: string
  file_url?: string
  is_premium?: boolean
  status?: string
}) {
  const { supabase } = await requireAdmin()

  const row = {
    title: data.title,
    description: data.description || null,
    category: data.category || 'guide',
    file_url: data.file_url || null,
    is_premium: data.is_premium ?? false,
    status: data.status || 'published',
  }

  if (data.id) {
    const { error } = await supabase.from('resources').update(row).eq('id', data.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('resources').insert(row)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteResource(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('resources').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content')
  return { success: true }
}
