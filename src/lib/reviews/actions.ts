'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { createInAppNotification } from '@/lib/notifications/actions'

export async function submitTeacherReview(data: {
  teacherId: string
  assignmentId: string
  rating: number
  comment?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  if (data.rating < 1 || data.rating > 5) throw new Error('Rating must be between 1 and 5')

  const { data: assignment } = await supabase
    .from('assignments')
    .select('parent_id, teacher_id, status, subject')
    .eq('id', data.assignmentId)
    .single()

  if (!assignment || assignment.parent_id !== user.id) {
    throw new Error('You can only review your assigned teachers')
  }

  if (assignment.teacher_id !== data.teacherId) {
    throw new Error('Teacher does not match this assignment')
  }

  const { data: existing } = await supabase
    .from('teacher_reviews')
    .select('id')
    .eq('assignment_id', data.assignmentId)
    .eq('parent_id', user.id)
    .maybeSingle()

  if (existing) throw new Error('You have already reviewed this assignment')

  const { error } = await supabase.from('teacher_reviews').insert({
    teacher_id: data.teacherId,
    parent_id: user.id,
    assignment_id: data.assignmentId,
    rating: data.rating,
    comment: data.comment?.trim() || null,
  })

  if (error) throw new Error(error.message)

  await createInAppNotification({
    recipientId: data.teacherId,
    recipientRole: 'teacher',
    title: 'New review received',
    body: `A parent left a ${data.rating}-star review for ${assignment.subject || 'your tutoring'}.`,
  })

  revalidatePath('/parent/dashboard')
  revalidatePath(`/teachers/${data.teacherId}`)
  return { success: true }
}

export async function getReviewForAssignment(assignmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('teacher_reviews')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('parent_id', user.id)
    .maybeSingle()

  return data
}

export async function getTeacherRatingStats(teacherId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('teacher_reviews')
    .select('rating')
    .eq('teacher_id', teacherId)

  if (!data?.length) return { average: null, count: 0 }

  const average = data.reduce((s, r) => s + r.rating, 0) / data.length
  return { average: Math.round(average * 10) / 10, count: data.length }
}

export async function getAllReviews() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin') throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('teacher_reviews')
    .select(`*, teacher:teachers(full_name, name, email)`)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw new Error(error.message)
  return data || []
}
