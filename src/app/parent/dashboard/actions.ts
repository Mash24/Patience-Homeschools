'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function requireParent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'parent') throw new Error('Unauthorized')

  return { supabase, userId: user.id }
}

export async function updateParentProfile(data: { full_name: string; phone?: string }) {
  const { supabase, userId } = await requireParent()

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: data.full_name, phone: data.phone || null })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/parent/dashboard')
  return { success: true }
}

export async function addChild(data: { full_name: string; level?: string; notes?: string }) {
  const { supabase, userId } = await requireParent()

  const { error } = await supabase.from('children').insert({
    parent_id: userId,
    full_name: data.full_name,
    level: data.level || null,
    notes: data.notes || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/parent/dashboard')
  return { success: true }
}

export async function completeParentOnboarding() {
  const { supabase, userId } = await requireParent()

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/parent/dashboard')
  return { success: true }
}

export async function updateChild(
  childId: string,
  data: { full_name: string; level?: string; notes?: string }
) {
  const { supabase, userId } = await requireParent()

  const { error } = await supabase
    .from('children')
    .update({
      full_name: data.full_name,
      level: data.level || null,
      notes: data.notes || null,
    })
    .eq('id', childId)
    .eq('parent_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/parent/dashboard')
  return { success: true }
}
