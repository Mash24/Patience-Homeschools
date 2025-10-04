'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function qualifyParent(parentId: string) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Update parent status
  const { error: updateError } = await supabase
    .from('parents')
    .update({ status: 'qualified' })
    .eq('id', parentId)
  
  if (updateError) throw new Error(updateError.message)

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'parent',
    entity_id: parentId,
    action: 'qualify'
  })

  revalidatePath('/admin/parents')
  return { success: true }
}

export async function rejectParent(parentId: string, reason: string) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Update parent status
  const { error: updateError } = await supabase
    .from('parents')
    .update({ status: 'rejected' })
    .eq('id', parentId)
  
  if (updateError) throw new Error(updateError.message)

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'parent',
    entity_id: parentId,
    action: 'reject',
    meta: { reason }
  })

  revalidatePath('/admin/parents')
  return { success: true }
}

export async function getParents(status?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('parents')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  
  if (error) throw new Error(error.message)
  return data
}

export async function getAvailableTeachers(subjects?: string[]) {
  const supabase = await createClient()
  
  let query = supabase
    .from('teachers')
    .select('*')
    .eq('status', 'approved')
    .order('full_name')

  const { data, error } = await query
  
  if (error) throw new Error(error.message)
  
  // Filter by subjects if provided
  if (subjects && subjects.length > 0) {
    return data?.filter(teacher => 
      subjects.some(subject => teacher.subjects?.includes(subject))
    ) || []
  }
  
  return data
}
