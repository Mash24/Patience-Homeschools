'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createAssignment(
  parentId: string, 
  teacherId: string, 
  startDate?: string, 
  hourlyRate?: number,
  notes?: string
) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Create assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .insert({ 
      parent_id: parentId, 
      teacher_id: teacherId, 
      status: 'active', 
      start_date: startDate || null,
      hourly_rate: hourlyRate || null,
      notes: notes || null
    })
    .select('*')
    .single()
  
  if (assignmentError) throw new Error(assignmentError.message)

  // Update parent status
  await supabase
    .from('parents')
    .update({ status: 'assigned' })
    .eq('id', parentId)

  // Get parent and teacher info for notifications
  const { data: parent } = await supabase
    .from('parents')
    .select('user_id, full_name, child_name')
    .eq('id', parentId)
    .single()

  const { data: teacher } = await supabase
    .from('teachers')
    .select('user_id, full_name')
    .eq('id', teacherId)
    .single()

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'assignment',
    entity_id: assignment.id,
    action: 'assign',
    meta: { parentId, teacherId }
  })

  // Create notifications
  const notifications = []
  
  if (parent?.user_id) {
    notifications.push({
      recipient_id: parent.user_id,
      recipient_role: 'parent',
      title: 'Teacher Assigned!',
      body: `Great news! We have assigned teacher ${teacher?.full_name} to work with ${parent.child_name}. You can now coordinate schedules and begin lessons.`
    })
  }
  
  if (teacher?.user_id) {
    notifications.push({
      recipient_id: teacher.user_id,
      recipient_role: 'teacher',
      title: 'New Assignment',
      body: `You have been assigned to work with ${parent?.child_name} (parent: ${parent?.full_name}). Please coordinate schedules and begin lessons.`
    })
  }

  if (notifications.length > 0) {
    await supabase.from('notifications').insert(notifications)
  }

  revalidatePath('/admin/assignments')
  revalidatePath('/admin/parents')
  return { success: true, assignment }
}

export async function updateAssignmentStatus(assignmentId: string, status: string) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Update assignment status
  const { error } = await supabase
    .from('assignments')
    .update({ status })
    .eq('id', assignmentId)
  
  if (error) throw new Error(error.message)

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'assignment',
    entity_id: assignmentId,
    action: 'update_status',
    meta: { status }
  })

  revalidatePath('/admin/assignments')
  return { success: true }
}

export async function getAssignments(status?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('assignments')
    .select(`
      *,
      parent:profiles(full_name, phone),
      teacher:teachers(full_name, email, phone, subjects),
      child:children(full_name, level)
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data
}

export async function bulkUpdateAssignmentStatus(assignmentIds: string[], status: string) {
  if (!assignmentIds.length) return { success: true, count: 0 }
  let count = 0
  for (const id of assignmentIds) {
    await updateAssignmentStatus(id, status)
    count += 1
  }
  return { success: true, count }
}

export async function exportAssignmentsCsv(status?: string) {
  const rows = await getAssignments(status === 'all' ? undefined : status)
  const header = 'id,status,subject,parent,child,teacher,teacher_email,hourly_rate,created_at'
  const lines = (rows || []).map((a: Record<string, unknown>) => {
    const parent = a.parent as { full_name?: string } | null
    const teacher = a.teacher as { full_name?: string; email?: string } | null
    const child = a.child as { full_name?: string } | null
    const esc = (v: string) => `"${(v || '').replace(/"/g, '""')}"`
    return [
      a.id,
      a.status,
      esc(String(a.subject || '')),
      esc(parent?.full_name || ''),
      esc(child?.full_name || ''),
      esc(teacher?.full_name || ''),
      esc(teacher?.email || ''),
      a.hourly_rate ?? '',
      a.created_at,
    ].join(',')
  })
  return [header, ...lines].join('\n')
}
