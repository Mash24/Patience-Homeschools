import { NextRequest, NextResponse } from 'next/server'
import { TeacherApplicationSchema } from '@/lib/schemas'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body against our schema
    const validatedData = TeacherApplicationSchema.parse(body)
    
    // Generate a unique application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured - storing in memory for demo')
      // For demo purposes, return a mock response
      return NextResponse.json({ 
        success: true, 
        id: applicationId,
        message: 'Application submitted successfully (demo mode)' 
      })
    }

    const supabase = supabaseServer
    
    // Insert the teacher application into the database
    const { data, error } = await supabase
      .from('teachers')
      .insert({
        name: validatedData.personalInfo.fullName,
        email: validatedData.personalInfo.email,
        phone: validatedData.personalInfo.phone,
        city: validatedData.personalInfo.location,
        bio: validatedData.additionalInfo.teachingPhilosophy,
        curricula: validatedData.experience.curriculumExperience,
        subjects: validatedData.experience.subjectsTaught,
        levels: [], // Not captured in current form - could be added later
        mode: validatedData.availability.onlineTeaching ? 'both' : 'in_home', // Fixed logic
        service_areas: [validatedData.personalInfo.location],
        years_experience: parseInt(validatedData.experience.yearsOfExperience.split('-')[0]) || 0,
        tsc_number: validatedData.education.tscNumber || null,
        verified: false,
        status: 'pending'
      })
      .select('id')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save teacher application' 
        }, 
        { status: 500 }
      )
    }

    console.log('Teacher Application Saved:', {
      id: data.id,
      applicationId,
      data: validatedData,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({
      success: true,
      id: applicationId,
      teacherId: data.id, // Return the actual database UUID
      message: 'Application submitted successfully! We will review your application and get back to you within 48 hours.',
      data: {
        applicationId,
        teacherId: data.id,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Teacher application submission error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data. Please check your inputs and try again.',
          details: error.message
        },
        { status: 400 }
      )
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save teacher application. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Teacher application API endpoint',
    methods: ['POST'],
    description: 'Submit teacher applications to Nelimac Learning'
  })
}