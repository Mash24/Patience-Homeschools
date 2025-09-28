import { NextResponse } from 'next/server'
import { ParentLeadSchema } from '@/lib/schemas'
import { supabaseServer } from '@/lib/supabaseServer'
import { sendParentLeadNotification } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate the request body
    const parsed = ParentLeadSchema.safeParse(body)
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
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured - storing in memory for demo')
      // For demo purposes, return a mock response
      return NextResponse.json({ 
        success: true, 
        id: `demo-lead-${Date.now()}`,
        message: 'Lead submitted successfully (demo mode)' 
      })
    }

    const supabase = supabaseServer
    
    // Insert the lead into the database
    const { data, error } = await supabase
      .from('parent_leads')
      .insert({
        parent_name: parsed.data.parentName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        child_first_name: parsed.data.childFirstName,
        grade_level: parsed.data.gradeLevel,
        curricula: parsed.data.curricula,
        subjects: parsed.data.subjects,
        goals: parsed.data.goals,
        mode: parsed.data.mode,
        location_area: parsed.data.locationArea,
        schedule_note: parsed.data.scheduleNote,
        budget_band: parsed.data.budgetBand,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save lead' }, 
        { status: 500 }
      )
    }

    // Send notification email to admin
    try {
      await sendParentLeadNotification({
        id: data.id,
        parentName: parsed.data.parentName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        childFirstName: parsed.data.childFirstName,
        gradeLevel: parsed.data.gradeLevel,
        curricula: parsed.data.curricula,
        subjects: parsed.data.subjects,
        mode: parsed.data.mode,
      })
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      id: data.id,
      message: 'Lead submitted successfully' 
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
    const supabase = supabaseServer
    
    const { data, error } = await supabase
      .from('parent_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leads' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ leads: data })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
