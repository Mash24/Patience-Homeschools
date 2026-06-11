'use server'

import { createClient } from '@/lib/supabase-server'
import { supabaseServer } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'

const ALLOWED_KINDS = [
  'cv',
  'profile_photo',
  'tsc_certificate',
  'education_certificate',
  'other_document',
] as const

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

async function requireTeacher() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'teacher') throw new Error('Unauthorized')

  return { supabase, userId: user.id }
}

export async function uploadTeacherDocumentFile(formData: FormData) {
  const { userId } = await requireTeacher()

  const file = formData.get('file') as File | null
  const kind = (formData.get('kind') as string) || 'other_document'

  if (!file || file.size === 0) throw new Error('No file selected')
  if (!ALLOWED_KINDS.includes(kind as typeof ALLOWED_KINDS[number])) {
    throw new Error('Invalid document type')
  }
  if (file.size > MAX_SIZE) throw new Error('File must be under 10MB')

  const ext = file.name.split('.').pop() || 'bin'
  const filePath = `teacher_${userId}/${kind}_${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseServer.storage
    .from('teacher-docs')
    .upload(filePath, buffer, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error(uploadError.message)

  const { data, error } = await supabaseServer
    .from('teacher_documents')
    .insert({
      teacher_id: userId,
      kind,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single()

  if (error) {
    await supabaseServer.storage.from('teacher-docs').remove([filePath])
    throw new Error(error.message)
  }

  revalidatePath('/teacher/dashboard')
  return data
}

export async function getTeacherDocumentUrl(filePath: string) {
  const { userId } = await requireTeacher()

  if (!filePath.startsWith(`teacher_${userId}/`)) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabaseServer.storage
    .from('teacher-docs')
    .createSignedUrl(filePath, 3600)

  if (error || !data?.signedUrl) throw new Error('Could not generate download link')
  return data.signedUrl
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin') throw new Error('Unauthorized')

  return { supabase, adminId: user.id }
}

export async function getPendingDocuments() {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('teacher_documents')
    .select(`*, teacher:teachers(full_name, email, status)`)
    .is('verified_at', null)
    .is('rejection_reason', null)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw new Error(error.message)
  return data || []
}

export async function getAdminDocumentUrl(filePath: string) {
  await requireAdmin()

  const { data, error } = await supabaseServer.storage
    .from('teacher-docs')
    .createSignedUrl(filePath, 3600)

  if (error || !data?.signedUrl) throw new Error('Could not generate download link')
  return data.signedUrl
}

export async function bulkVerifyDocuments(documentIds: string[]) {
  if (!documentIds.length) return { success: true, count: 0 }
  let count = 0
  for (const id of documentIds) {
    await verifyTeacherDocument(id)
    count += 1
  }
  return { success: true, count }
}

export async function bulkRejectDocuments(documentIds: string[], reason: string) {
  if (!documentIds.length) return { success: true, count: 0 }
  if (!reason.trim()) throw new Error('Rejection reason is required')
  let count = 0
  for (const id of documentIds) {
    await rejectTeacherDocument(id, reason)
    count += 1
  }
  return { success: true, count }
}

export async function verifyTeacherDocument(documentId: string) {
  const { supabase, adminId } = await requireAdmin()

  const { data: doc } = await supabase
    .from('teacher_documents')
    .select('teacher_id, kind, file_name')
    .eq('id', documentId)
    .single()

  if (!doc) throw new Error('Document not found')

  const { error } = await supabase
    .from('teacher_documents')
    .update({
      verified_at: new Date().toISOString(),
      verified_by: adminId,
      rejection_reason: null,
    })
    .eq('id', documentId)

  if (error) throw new Error(error.message)

  await supabase.from('notifications').insert({
    recipient_id: doc.teacher_id,
    recipient_role: 'teacher',
    title: 'Document verified',
    body: `Your ${doc.kind.replace(/_/g, ' ')} (${doc.file_name}) has been verified.`,
  })

  await supabase.from('admin_actions').insert({
    admin_id: adminId,
    entity_type: 'teacher',
    entity_id: doc.teacher_id,
    action: 'verify_document',
    meta: { document_id: documentId, kind: doc.kind },
  })

  revalidatePath('/admin/documents')
  revalidatePath('/admin/teachers')
  return { success: true }
}

export async function rejectTeacherDocument(documentId: string, reason: string) {
  const { supabase, adminId } = await requireAdmin()
  if (!reason.trim()) throw new Error('Rejection reason is required')

  const { data: doc } = await supabase
    .from('teacher_documents')
    .select('teacher_id, kind, file_name')
    .eq('id', documentId)
    .single()

  if (!doc) throw new Error('Document not found')

  const { error } = await supabase
    .from('teacher_documents')
    .update({
      verified_at: null,
      verified_by: null,
      rejection_reason: reason.trim(),
    })
    .eq('id', documentId)

  if (error) throw new Error(error.message)

  await supabase.from('notifications').insert({
    recipient_id: doc.teacher_id,
    recipient_role: 'teacher',
    title: 'Document needs attention',
    body: `Your ${doc.kind.replace(/_/g, ' ')} was not accepted: ${reason.trim()}`,
  })

  await supabase.from('admin_actions').insert({
    admin_id: adminId,
    entity_type: 'teacher',
    entity_id: doc.teacher_id,
    action: 'reject_document',
    meta: { document_id: documentId, reason: reason.trim() },
  })

  revalidatePath('/admin/documents')
  revalidatePath('/admin/teachers')
  return { success: true }
}

export async function replaceRejectedDocument(documentId: string, formData: FormData) {
  const { supabase, userId } = await requireTeacher()

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) throw new Error('No file selected')
  if (file.size > MAX_SIZE) throw new Error('File must be under 10MB')

  const { data: doc } = await supabase
    .from('teacher_documents')
    .select('file_path, kind, rejection_reason')
    .eq('id', documentId)
    .eq('teacher_id', userId)
    .single()

  if (!doc) throw new Error('Document not found')
  if (!doc.rejection_reason) throw new Error('Only rejected documents can be replaced')

  const ext = file.name.split('.').pop() || 'bin'
  const filePath = `teacher_${userId}/${doc.kind}_${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseServer.storage
    .from('teacher-docs')
    .upload(filePath, buffer, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error(uploadError.message)

  const { error: updateError } = await supabase
    .from('teacher_documents')
    .update({
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      verified_at: null,
      verified_by: null,
      rejection_reason: null,
    })
    .eq('id', documentId)
    .eq('teacher_id', userId)

  if (updateError) {
    await supabaseServer.storage.from('teacher-docs').remove([filePath])
    throw new Error(updateError.message)
  }

  await supabaseServer.storage.from('teacher-docs').remove([doc.file_path])

  revalidatePath('/teacher/dashboard')
  revalidatePath('/admin/documents')
  return { success: true }
}

export async function deleteTeacherDocumentRecord(documentId: string) {
  const { supabase, userId } = await requireTeacher()

  const { data: doc } = await supabase
    .from('teacher_documents')
    .select('file_path')
    .eq('id', documentId)
    .eq('teacher_id', userId)
    .single()

  if (!doc) throw new Error('Document not found')

  await supabaseServer.storage.from('teacher-docs').remove([doc.file_path])
  const { error } = await supabase
    .from('teacher_documents')
    .delete()
    .eq('id', documentId)
    .eq('teacher_id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/teacher/dashboard')
  return { success: true }
}
