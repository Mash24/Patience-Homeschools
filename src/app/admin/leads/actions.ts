'use server'

import { createClient } from '@/lib/supabase-server'
import { supabaseServer } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'
import {
  sendLeadStatusEmail,
  sendParentAccountInviteEmail,
} from '@/lib/email'
import { getAppUrl } from '@/lib/auth-redirect'

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

export async function bulkUpdateLeadStatus(leadIds: string[], status: LeadStatus) {
  if (!leadIds.length) return { success: true, count: 0 }
  let count = 0
  for (const id of leadIds) {
    await updateLeadStatus(id, status)
    count += 1
  }
  revalidatePath('/admin/leads')
  return { success: true, count }
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const { supabase, adminId } = await requireAdmin()

  const { data: lead, error: fetchError } = await supabase
    .from('parent_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (fetchError || !lead) throw new Error('Lead not found')

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

  if (status === 'shortlisted' || status === 'matched' || status === 'closed') {
    try {
      await sendLeadStatusEmail({
        parentName: lead.parent_name,
        email: lead.email,
        status,
      })
    } catch (emailError) {
      console.error('Lead status email error:', emailError)
    }
  }

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function convertLeadToParent(leadId: string) {
  const { supabase, adminId } = await requireAdmin()
  const admin = supabaseServer
  const appUrl = getAppUrl()

  const { data: lead, error: fetchError } = await supabase
    .from('parent_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (fetchError || !lead) throw new Error('Lead not found')

  let userId: string

  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    lead.email,
    {
      redirectTo: `${appUrl}/auth/callback?redirectTo=${encodeURIComponent('/parent/dashboard')}`,
      data: {
        full_name: lead.parent_name,
        role: 'parent',
        phone: lead.phone,
      },
    }
  )

  if (inviteError) {
    const { data: listData } = await admin.auth.admin.listUsers()
    const existing = listData?.users?.find((u) => u.email === lead.email)

    if (!existing) throw new Error(inviteError.message)
    userId = existing.id

    await admin.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: lead.parent_name,
        role: 'parent',
        phone: lead.phone,
        lead_status: 'shortlisted',
      },
    })
  } else {
    userId = inviteData.user.id
    await admin.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: lead.parent_name,
        role: 'parent',
        phone: lead.phone,
        lead_status: 'shortlisted',
      },
    })
  }

  await admin.from('profiles').upsert({
    id: userId,
    role: 'parent',
    full_name: lead.parent_name,
    phone: lead.phone || null,
  })

  if (lead.child_first_name) {
    const { data: existingChildren } = await admin
      .from('children')
      .select('id')
      .eq('parent_id', userId)
      .eq('full_name', lead.child_first_name)
      .maybeSingle()

    if (!existingChildren) {
      await admin.from('children').insert({
        parent_id: userId,
        full_name: lead.child_first_name,
        level: lead.grade_level || null,
        notes: lead.goals || null,
      })
    }
  }

  await supabase
    .from('parent_leads')
    .update({ status: 'shortlisted' })
    .eq('id', leadId)

  await supabase.from('admin_actions').insert({
    admin_id: adminId,
    entity_type: 'parent_lead',
    entity_id: leadId,
    action: 'convert_to_parent',
  })

  try {
    await sendParentAccountInviteEmail({
      parentName: lead.parent_name,
      email: lead.email,
    })
    await sendLeadStatusEmail({
      parentName: lead.parent_name,
      email: lead.email,
      status: 'shortlisted',
    })
  } catch (emailError) {
    console.error('Invite email error:', emailError)
  }

  revalidatePath('/admin/leads')
  revalidatePath('/admin/parents')
  return { success: true, userId }
}

export async function exportLeadsCsv(status?: string) {
  const leads = await getLeads(status === 'all' ? undefined : status)

  const headers = [
    'parent_name',
    'email',
    'phone',
    'child_first_name',
    'grade_level',
    'subjects',
    'city',
    'mode',
    'status',
    'created_at',
  ]

  const escape = (val: unknown) => {
    const s = val == null ? '' : String(val)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const rows = (leads || []).map((lead: Record<string, unknown>) =>
    headers.map((h) => {
      const val = lead[h]
      if (h === 'subjects' && Array.isArray(val)) return escape(val.join('; '))
      return escape(val)
    }).join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}
