'use server'

import { supabaseServer } from '@/lib/supabaseServer'

export interface PublicEvent {
  id: string
  title: string
  description?: string
  event_type: string
  date: string
  location?: string
  max_attendees?: number
}

export interface PublicResource {
  id: string
  title: string
  description?: string
  category: string
  file_url?: string
  is_premium: boolean
}

export async function getPublishedEvents() {
  const { data, error } = await supabaseServer
    .from('events')
    .select('id, title, description, event_type, date, location, max_attendees')
    .eq('status', 'published')
    .order('date', { ascending: true })

  if (error) {
    console.error('getPublishedEvents:', error)
    return []
  }
  return (data || []) as PublicEvent[]
}

export async function getPublishedResources() {
  const { data, error } = await supabaseServer
    .from('resources')
    .select('id, title, description, category, file_url, is_premium')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPublishedResources:', error)
    return []
  }
  return (data || []) as PublicResource[]
}
