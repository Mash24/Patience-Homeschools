'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function updateTeacherProfile(data: {
  phone?: string
  bio?: string
  location_area?: string
  hourly_rate_range?: string
  availability?: string[]
  teaching_philosophy?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'teacher') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('teachers')
    .update({
      phone: data.phone?.trim() || null,
      bio: data.bio?.trim() || null,
      location_area: data.location_area?.trim() || null,
      hourly_rate_range: data.hourly_rate_range?.trim() || null,
      availability: data.availability || [],
      teaching_philosophy: data.teaching_philosophy?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  if (data.phone) {
    await supabase.from('profiles').update({ phone: data.phone.trim() }).eq('id', user.id)
  }

  revalidatePath('/teacher/dashboard')
  revalidatePath(`/teachers/${user.id}`)
  return { success: true }
}
