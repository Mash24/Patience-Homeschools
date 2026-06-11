'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { sendTeacherApprovalEmail, sendTeacherRejectionEmail } from '@/lib/email'
import { getSystemSettings } from '@/lib/admin/settings-actions'

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
    .select('id, full_name, email')
    .eq('id', teacherId)
    .single()

  // Log admin action
  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'teacher',
    entity_id: teacherId,
    action: 'approve'
  })

  if (teacher?.id) {
    await supabase.from('notifications').insert({
      recipient_id: teacher.id,
      recipient_role: 'teacher',
      title: 'Application Approved',
      body: `Congratulations ${teacher.full_name}! Your teacher application has been approved. You now have full dashboard access.`
    })

    try {
      const settings = await getSystemSettings()
      if (settings.notification_settings.email_enabled && teacher.email) {
        await sendTeacherApprovalEmail({
          name: teacher.full_name,
          email: teacher.email,
          customMessage: settings.email_templates.approval,
        })
      }
    } catch (e) {
      console.error('Approval email error:', e)
    }
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
    .select('id, full_name, email')
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

  if (teacher?.id) {
    await supabase.from('notifications').insert({
      recipient_id: teacher.id,
      recipient_role: 'teacher',
      title: 'Application Update',
      body: `Thank you for your interest ${teacher.full_name}. Unfortunately, we cannot approve your application at this time. Reason: ${reason}`
    })

    try {
      const settings = await getSystemSettings()
      if (settings.notification_settings.email_enabled && teacher.email) {
        await sendTeacherRejectionEmail({
          name: teacher.full_name,
          email: teacher.email,
          reason,
          customMessage: settings.email_templates.rejection,
        })
      }
    } catch (e) {
      console.error('Rejection email error:', e)
    }
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

export async function toggleTeacherFeatured(teacherId: string, featured: boolean) {
  const supabase = await createClient()
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) throw new Error('Not authenticated')

  const { data: teacher, error: fetchError } = await supabase
    .from('teachers')
    .select('id, status, full_name')
    .eq('id', teacherId)
    .single()

  if (fetchError || !teacher) throw new Error('Teacher not found')
  if (teacher.status !== 'approved') throw new Error('Only approved teachers can be featured')

  const { error } = await supabase
    .from('teachers')
    .update({ is_featured: featured })
    .eq('id', teacherId)

  if (error) throw new Error(error.message)

  await supabase.from('admin_actions').insert({
    admin_id: adminUser.id,
    entity_type: 'teacher',
    entity_id: teacherId,
    action: featured ? 'feature' : 'unfeature',
    meta: { full_name: teacher.full_name },
  })

  revalidatePath('/admin/teachers')
  revalidatePath('/hire-teacher')
  return { success: true }
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
