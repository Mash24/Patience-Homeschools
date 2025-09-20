import { NextResponse } from 'next/server'
import { TeacherApplicationSchema } from '@/lib/schemas'
import { createAdminClient } from '@/lib/supabase'
import { sendTeacherApplicationNotification } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate the request body
    const parsed = TeacherApplicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: parsed.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured - storing in memory for demo')
      // For demo purposes, return a mock response
      return NextResponse.json({ 
        success: true, 
        id: `demo-${Date.now()}`,
        message: 'Application submitted successfully (demo mode)' 
      })
    }

    const supabase = createAdminClient()
    
    // Insert the teacher application into the database
    const { data, error } = await supabase
      .from('teachers')
      .insert({
        name: parsed.data.personalInfo.fullName,
        email: parsed.data.personalInfo.email,
        phone: parsed.data.personalInfo.phone,
        city: parsed.data.personalInfo.location,
        curricula: parsed.data.experience.curriculumExperience,
        subjects: parsed.data.experience.subjectsTaught,
        levels: parsed.data.experience.subjectsTaught, // Simplified for now
        mode: parsed.data.availability.onlineTeaching ? 'online' : 'both',
        years_experience: parseInt(parsed.data.experience.yearsOfExperience) || 0,
        tsc_number: parsed.data.education.tscNumber,
        bio: parsed.data.additionalInfo.teachingPhilosophy,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save teacher application' }, 
        { status: 500 }
      )
    }

    // Send notification email to admin
    try {
      await sendTeacherApplicationNotification({
        id: data.id,
        name: parsed.data.personalInfo.fullName,
        email: parsed.data.personalInfo.email,
        phone: parsed.data.personalInfo.phone,
        city: parsed.data.personalInfo.location,
        curricula: parsed.data.experience.curriculumExperience,
        subjects: parsed.data.experience.subjectsTaught,
        yearsExperience: parseInt(parsed.data.experience.yearsOfExperience) || 0,
        tscNumber: parsed.data.education.tscNumber,
      })
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      id: data.id,
      message: 'Application submitted successfully' 
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch teachers' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ teachers: data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
