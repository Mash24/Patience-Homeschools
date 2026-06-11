'use server'

import { createClient } from '@/lib/supabase-server'
import { supabaseServer } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'
import {
  sendEventRegistrationEmail,
  sendEventRegistrationAdminNotification,
  sendEventConfirmedEmail,
} from '@/lib/email'

export async function registerForEvent(data: {
  eventId: string
  fullName: string
  email: string
  phone?: string
  notes?: string
}) {
  if (!data.fullName.trim() || !data.email.includes('@')) {
    throw new Error('Name and valid email are required')
  }

  const { data: event } = await supabaseServer
    .from('events')
    .select('id, title, date, max_attendees, status')
    .eq('id', data.eventId)
    .eq('status', 'published')
    .single()

  if (!event) throw new Error('Event not found or no longer available')

  if (event.max_attendees) {
    const { count } = await supabaseServer
      .from('event_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', data.eventId)
      .neq('status', 'cancelled')

    if (count != null && count >= event.max_attendees) {
      throw new Error('This event is fully booked')
    }
  }

  const { error } = await supabaseServer.from('event_registrations').insert({
    event_id: data.eventId,
    full_name: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    notes: data.notes?.trim() || null,
  })

  if (error) {
    if (error.code === '23505') throw new Error('You are already registered for this event')
    throw new Error(error.message)
  }

  try {
    await Promise.all([
      sendEventRegistrationEmail({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        eventTitle: event.title,
        eventDate: event.date,
      }),
      sendEventRegistrationAdminNotification({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        eventTitle: event.title,
      }),
    ])
  } catch (emailErr) {
    console.error('Event registration email error:', emailErr)
  }

  revalidatePath('/events')
  revalidatePath('/admin/content')
  return { success: true }
}

export async function getEventRegistrations(eventId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin') throw new Error('Unauthorized')

  let query = supabase
    .from('event_registrations')
    .select(`*, event:events(title, date)`)
    .order('created_at', { ascending: false })
    .limit(100)

  if (eventId) query = query.eq('event_id', eventId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export async function updateRegistrationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin') throw new Error('Unauthorized')

  const { data: registration } = await supabase
    .from('event_registrations')
    .select(`*, event:events(title, date, location)`)
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('event_registrations')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)

  if (status === 'confirmed' && registration) {
    const event = registration.event as { title?: string; date?: string; location?: string } | null
    try {
      await sendEventConfirmedEmail({
        fullName: registration.full_name,
        email: registration.email,
        eventTitle: event?.title || 'Nelimac event',
        eventDate: event?.date || new Date().toISOString(),
        location: event?.location,
      })
    } catch (emailErr) {
      console.error('Event confirmation email error:', emailErr)
    }
  }

  await supabase.from('admin_actions').insert({
    admin_id: user.id,
    entity_type: 'system',
    entity_id: id,
    action: `registration_${status}`,
  })

  revalidatePath('/admin/content')
  return { success: true }
}
