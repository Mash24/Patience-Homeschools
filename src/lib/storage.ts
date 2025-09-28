import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  filePath?: string
  error?: string
}

export async function uploadTeacherDocument(
  file: File,
  teacherId: string,
  documentType: string,
  customPath?: string
): Promise<UploadResult> {
  try {
    let filePath: string
    
    if (customPath) {
      filePath = customPath
    } else {
      // Create a unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${documentType}_${Date.now()}.${fileExtension}`
      filePath = `teacher_${teacherId}/${fileName}`
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('teacher-docs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      filePath: data.path
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Failed to upload file'
    }
  }
}

export async function getSignedUrl(filePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('teacher-docs')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error('Error creating signed URL:', error)
    return null
  }
}

export async function deleteTeacherDocument(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('teacher-docs')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

export async function getTeacherDocuments(teacherId: string) {
  try {
    const { data, error } = await supabase.storage
      .from('teacher-docs')
      .list(`teacher_${teacherId}`, {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Error listing documents:', error)
      return []
    }

    // Create signed URLs for each file
    const documentsWithUrls = await Promise.all(
      data.map(async (file) => {
        const signedUrl = await getSignedUrl(`teacher_${teacherId}/${file.name}`)
        return {
          ...file,
          signedUrl
        }
      })
    )

    return documentsWithUrls
  } catch (error) {
    console.error('Error getting teacher documents:', error)
    return []
  }
}
