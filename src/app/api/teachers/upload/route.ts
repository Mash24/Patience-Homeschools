import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const teacherId = formData.get('teacherId') as string
    const documentType = formData.get('documentType') as string

    console.log('File upload request:', {
      fileName: file?.name,
      fileSize: file?.size,
      teacherId,
      documentType
    })

    if (!file || !teacherId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate teacherId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(teacherId)) {
      console.error('Invalid teacherId format:', teacherId)
      return NextResponse.json(
        { error: 'Invalid teacher ID format' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured - file upload disabled')
      return NextResponse.json(
        { 
          success: false, 
          error: 'File upload not configured' 
        },
        { status: 503 }
      )
    }

    const supabase = createAdminClient()

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${teacherId}/${documentType}_${Date.now()}_${file.name}`
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('teacher-docs')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Save document record to database
    const { data: docData, error: docError } = await supabase
      .from('teacher_documents')
      .insert({
        teacher_id: teacherId,
        kind: documentType,
        file_path: uploadData.path
      })
      .select('id')
      .single()

    if (docError) {
      console.error('Document record error:', docError)
      // Try to clean up uploaded file
      await supabase.storage.from('teacher-docs').remove([fileName])
      return NextResponse.json(
        { error: 'Failed to save document record' },
        { status: 500 }
      )
    }

    console.log('File upload successful:', {
      documentId: docData.id,
      filePath: uploadData.path,
      fileName: file.name,
      fileSize: file.size,
      teacherId,
      documentType
    })

    return NextResponse.json({
      success: true,
      documentId: docData.id,
      filePath: uploadData.path,
      fileName: file.name,
      fileSize: file.size
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
