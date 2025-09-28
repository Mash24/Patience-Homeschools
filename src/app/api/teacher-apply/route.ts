import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { uploadTeacherDocument } from '@/lib/storage'

// Fixed: Removed application_date references to resolve TypeScript errors

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Extract data from form
    const {
      fullName,
      email,
      phone,
      location,
      gender,
      dateOfBirth,
      subjects,
      curricula,
      gradeLevels,
      experienceYears,
      educationBackground,
      teachingPhilosophy,
      availability,
      hourlyRateRange,
      tscNumber,
      documents
    } = formData

    // Check for duplicate applications by email in both auth.users and teachers table
    let existingApplications = null
    let existingUser = null
    let checkError = null
    
    try {
      // First check teachers table
      const result = await supabaseServer
        .from('teachers')
        .select('id, full_name, email, status, created_at')
        .eq('email', email)
        .order('created_at', { ascending: false })
      
      existingApplications = result.data
      checkError = result.error
      
      // Always check if user exists in auth system using listUsers
      try {
        const { data: userData, error: userError } = await supabaseServer.auth.admin.listUsers({
          page: 1,
          perPage: 1000 // Get all users to search through
        })
        
        if (!userError && userData && userData.users) {
          const foundUser = userData.users.find(user => user.email === email)
          if (foundUser) {
            existingUser = foundUser
          }
        }
      } catch (authError) {
        console.log('Could not check auth users:', authError)
      }
      
    } catch (error) {
      console.log('Error with query, trying with created_at only')
      const result = await supabaseServer
        .from('teachers')
        .select('id, full_name, email, status, created_at')
        .eq('email', email)
        .order('created_at', { ascending: false })
      
      existingApplications = result.data
      checkError = result.error
    }

    if (checkError) {
      console.error('Error checking for duplicate applications:', checkError)
      return NextResponse.json(
        { error: 'Failed to check application status' },
        { status: 500 }
      )
    }

    // If there are existing applications OR existing user, return duplicate error
    if ((existingApplications && existingApplications.length > 0) || existingUser) {
      const latestApplication = existingApplications && existingApplications.length > 0 ? existingApplications[0] : null
      const applicationStatus = latestApplication ? latestApplication.status : 'pending'
      
      return NextResponse.json({
        success: false,
        error: 'DUPLICATE_APPLICATION',
        message: 'An account with this email already exists',
        data: {
          existingApplication: {
            id: latestApplication ? latestApplication.id : existingUser?.id,
            fullName: latestApplication ? latestApplication.full_name : existingUser?.user_metadata?.full_name || 'Unknown',
            email: email,
            status: applicationStatus,
            applicationDate: latestApplication ? latestApplication.created_at : existingUser?.created_at || new Date().toISOString()
          },
          options: {
            canSignIn: true,
            canResetPassword: true,
            canViewStatus: true
          }
        }
      }, { status: 409 }) // 409 Conflict status code
    }

    // Create user account silently using Supabase Admin API
    const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        phone,
        location,
        gender,
        date_of_birth: dateOfBirth
      }
    })

    if (authError) {
      console.error('Error creating user:', authError)
      
      // Check if it's an email exists error
      if (authError.message && authError.message.includes('email_exists')) {
        return NextResponse.json({
          success: false,
          error: 'DUPLICATE_APPLICATION',
          message: 'An account with this email already exists',
          data: {
            existingApplication: {
              id: 'existing',
              fullName: 'Unknown',
              email: email,
              status: 'pending',
              applicationDate: new Date().toISOString()
            },
            options: {
              canSignIn: true,
              canResetPassword: true,
              canViewStatus: true
            }
          }
        }, { status: 409 })
      }
      
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    // Create profile
    const { error: profileError } = await supabaseServer
      .from('profiles')
      .insert({
        id: userId,
        role: 'teacher',
        full_name: fullName,
        email,
        phone,
        gender,
        date_of_birth: dateOfBirth
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    // Create teacher record
    const teacherRecord: any = {
      id: userId,
      full_name: fullName,
      email,
      phone,
      location_area: location,
      subjects,
      curricula,
      grade_levels: gradeLevels,
      experience_years: experienceYears,
      education_background: educationBackground,
      teaching_philosophy: teachingPhilosophy,
      availability,
      hourly_rate_range: hourlyRateRange,
      tsc_number: tscNumber,
      status: 'submitted'
    }

    // Add optional fields if they exist
    if (gender) teacherRecord.gender = gender
    if (dateOfBirth) teacherRecord.date_of_birth = dateOfBirth

    const { error: teacherError } = await supabaseServer
      .from('teachers')
      .insert(teacherRecord)

    if (teacherError) {
      console.error('Error creating teacher record:', teacherError)
      return NextResponse.json(
        { error: 'Failed to create teacher record' },
        { status: 500 }
      )
    }

    // Create application steps
    const steps = [
      { step_name: 'personal_info', is_completed: true },
      { step_name: 'professional_info', is_completed: true },
      { step_name: 'documents', is_completed: true },
      { step_name: 'review', is_completed: true }
    ]

    const { error: stepsError } = await supabaseServer
      .from('teacher_application_steps')
      .insert(
        steps.map(step => ({
          teacher_id: userId,
          ...step,
          completed_at: new Date().toISOString()
        }))
      )

    if (stepsError) {
      console.error('Error creating application steps:', stepsError)
      // Don't fail the request for this
    }

    // Handle document uploads to Supabase Storage
    const documentUploads = []
    let profilePhotoUrl = null
    
    for (const [docType, file] of Object.entries(documents)) {
      if (file && file instanceof File) {
        try {
          const uploadResult = await uploadTeacherDocument(file, userId, docType)
          if (uploadResult.success && uploadResult.filePath) {
            // Store profile photo URL for user metadata
            if (docType === 'profilePhoto') {
              profilePhotoUrl = uploadResult.filePath
            }
            
            // Insert document record into database
            const { error: docError } = await supabaseServer
              .from('teacher_documents')
              .insert({
                teacher_id: userId,
                kind: docType,
                file_name: file.name,
                file_path: uploadResult.filePath,
                file_size: file.size,
                mime_type: file.type,
                is_required: ['cv', 'profilePhoto', 'tscCertificate', 'educationCertificate'].includes(docType)
              })

            if (docError) {
              console.error(`Error saving ${docType} document:`, docError)
            } else {
              documentUploads.push({ type: docType, success: true })
            }
          } else {
            console.error(`Failed to upload ${docType}:`, uploadResult.error)
            documentUploads.push({ type: docType, success: false, error: uploadResult.error })
          }
        } catch (error) {
          console.error(`Error processing ${docType}:`, error)
          documentUploads.push({ type: docType, success: false, error: 'Upload failed' })
        }
      }
    }

    // Update user metadata with profile photo URL if available
    if (profilePhotoUrl) {
      const { error: updateError } = await supabaseServer.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: fullName,
          phone,
          location,
          gender,
          date_of_birth: dateOfBirth,
          profile_photo_url: profilePhotoUrl
        }
      })
      
      if (updateError) {
        console.error('Error updating user metadata with profile photo:', updateError)
        // Don't fail the request for this
      }
    }

    // Send magic link email
    const { error: emailError } = await supabaseServer.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/dashboard`
      }
    })

    if (emailError) {
      console.error('Error sending magic link:', emailError)
      // Don't fail the request for this
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      userId
    })

  } catch (error) {
    console.error('Error in teacher application API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
