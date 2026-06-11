'use server'

import { createClient } from '@/lib/supabase-server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function getMyParentLead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data } = await supabase
    .from('parent_leads')
    .select('id, parent_name, status, child_first_name, grade_level, subjects, curricula, mode, city, created_at, goals')
    .eq('email', user.email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

export async function lookupLeadByEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  if (!normalized.includes('@')) return null

  const { data } = await supabaseServer
    .from('parent_leads')
    .select('status, child_first_name, grade_level, subjects, created_at')
    .eq('email', normalized)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return null

  return {
    status: data.status,
    childFirstName: data.child_first_name,
    gradeLevel: data.grade_level,
    subjects: data.subjects,
    submittedAt: data.created_at,
  }
}
