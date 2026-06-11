'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export type LeadStatus = 'new' | 'shortlisted' | 'matched' | 'closed'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'admin') throw new Error('Unauthorized')

  return { supabase, adminId: user.id }
}

export async function getLeads(status?: string) {
  const { supabase } = await requireAdmin()

  let query = supabase
    .from('parent_leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const { supabase, adminId } = await requireAdmin()

  const { error: updateError } = await supabase
    .from('parent_leads')
    .update({ status })
    .eq('id', leadId)

  if (updateError) throw new Error(updateError.message)

  await supabase.from('admin_actions').insert({
    admin_id: adminId,
    entity_type: 'parent_lead',
    entity_id: leadId,
    action: `status_${status}`,
  })

  revalidatePath('/admin/leads')
  return { success: true }
}
