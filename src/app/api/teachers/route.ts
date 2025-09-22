export const runtime = 'nodejs';

import { NextResponse } from 'next/server'
import { TeacherApplicationSchema } from '@/lib/schemas'
import { supabaseServer } from '@/lib/supabaseServer'
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

    // Debug: Log available env keys
    console.log(
      'Env keys present:',
      Object.keys(process.env).filter(k => k.includes('SUPABASE')).sort()
    );
    
    // Insert the teacher application into the database
    const { data, error } = await supabaseServer
      .from('teachers')
      .insert({
        full_name: parsed.data.personalInfo.fullName,
        email: parsed.data.personalInfo.email,
        phone: parsed.data.personalInfo.phone,
        location: parsed.data.personalInfo.location,
        qualification: parsed.data.education.highestQualification,
        institution: parsed.data.education.institution,
        tsc_number: parsed.data.education.tscNumber,
        years_experience_text: parsed.data.experience.yearsOfExperience,
        curriculum: parsed.data.experience.curriculumExperience,
        subjects: parsed.data.experience.subjectsTaught,
        teaching_philosophy: parsed.data.additionalInfo.teachingPhilosophy,
        motivation: parsed.data.additionalInfo.motivation,
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
        yearsExperience: parsed.data.experience.yearsOfExperience,
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
    const { data, error } = await supabaseServer
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
