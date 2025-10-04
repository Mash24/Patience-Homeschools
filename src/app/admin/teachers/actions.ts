'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function approveTeacher(teacherId: string) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Update teacher status
  const { error: updateError } = await supabase
    .from('teachers')
    .update({ 
      status: 'approved', 
      rejection_reason: null 
    })
    .eq('id', teacherId)
  
  if (updateError) throw new Error(updateError.message)

  // Get teacher info for notification
  const { data: teacher } = await supabase
    .from('teachers')
    .select('user_id, full_name, email')
    .eq('id', teacherId)
    .single()

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'teacher',
    entity_id: teacherId,
    action: 'approve'
  })

  // Create notification for teacher
  if (teacher?.user_id) {
    await supabase.from('notifications').insert({
      recipient_id: teacher.user_id,
      recipient_role: 'teacher',
      title: 'Application Approved',
      body: `Congratulations ${teacher.full_name}! Your teacher application has been approved. You now have full dashboard access.`
    })
  }

  revalidatePath('/admin/teachers')
  return { success: true }
}

export async function rejectTeacher(teacherId: string, reason: string) {
  const supabase = await createClient()
  
  // Get admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')
  
  // Update teacher status
  const { error: updateError } = await supabase
    .from('teachers')
    .update({ 
      status: 'rejected', 
      rejection_reason: reason 
    })
    .eq('id', teacherId)
  
  if (updateError) throw new Error(updateError.message)

  // Get teacher info for notification
  const { data: teacher } = await supabase
    .from('teachers')
    .select('user_id, full_name, email')
    .eq('id', teacherId)
    .single()

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'teacher',
    entity_id: teacherId,
    action: 'reject',
    meta: { reason }
  })

  // Create notification for teacher
  if (teacher?.user_id) {
    await supabase.from('notifications').insert({
      recipient_id: teacher.user_id,
      recipient_role: 'teacher',
      title: 'Application Update',
      body: `Thank you for your interest ${teacher.full_name}. Unfortunately, we cannot approve your application at this time. Reason: ${reason}`
    })
  }

  revalidatePath('/admin/teachers')
  return { success: true }
}

export async function getTeachers(status?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  
  if (error) throw new Error(error.message)
  return data
}

export async function getTeacherDocuments(teacherId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('teacher_documents')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}
