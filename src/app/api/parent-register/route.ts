import { NextResponse } from 'next/server'
import { ParentRegistrationSchema } from '@/lib/schemas'
import { supabaseServer } from '@/lib/supabaseServer'
import { sendParentRegistrationNotification } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate the request body
    const parsed = ParentRegistrationSchema.safeParse(body)
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
        id: `demo-parent-${Date.now()}`,
        message: 'Parent registered successfully (demo mode)' 
      })
    }

    const supabase = supabaseServer
    
    // Create user account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      user_metadata: {
        full_name: `${parsed.data.firstName} ${parsed.data.lastName}`,
        role: 'parent'
      },
      email_confirm: true // Auto-confirm email for demo
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account' }, 
        { status: 500 }
      )
    }

    const userId = authData.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to get user ID' }, 
        { status: 500 }
      )
    }

    // Insert parent profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        role: 'parent',
        full_name: `${parsed.data.firstName} ${parsed.data.lastName}`,
        phone: parsed.data.phone
      })
      .select('id')
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json(
        { error: 'Failed to create parent profile' }, 
        { status: 500 }
      )
    }

    // Insert parent details
    const { data: parentData, error: parentError } = await supabase
      .from('parents')
      .insert({
        user_id: userId,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        area: parsed.data.area,
        address: parsed.data.address,
        preferred_curricula: parsed.data.preferredCurricula,
        preferred_subjects: parsed.data.preferredSubjects,
        teaching_mode: parsed.data.teachingMode,
        goals: parsed.data.goals,
        budget_considerations: parsed.data.budgetConsiderations,
        schedule_preferences: parsed.data.schedulePreferences,
        emergency_contact: parsed.data.emergencyContact,
        preferred_contact_method: parsed.data.preferredContactMethod,
        newsletter_subscription: parsed.data.newsletterSubscription,
        sms_notifications: parsed.data.smsNotifications,
        status: 'active'
      })
      .select('id')
      .single()

    if (parentError) {
      console.error('Parent data error:', parentError)
      return NextResponse.json(
        { error: 'Failed to save parent data' }, 
        { status: 500 }
      )
    }

    // Insert children data
    if (parsed.data.children && parsed.data.children.length > 0) {
      const childrenData = parsed.data.children.map(child => ({
        parent_id: parentData.id,
        first_name: child.firstName,
        last_name: child.lastName,
        date_of_birth: child.dateOfBirth,
        grade_level: child.gradeLevel,
        school: child.school,
        special_needs: child.specialNeeds,
        interests: child.interests || []
      }))

      const { error: childrenError } = await supabase
        .from('children')
        .insert(childrenData)

      if (childrenError) {
        console.error('Children data error:', childrenError)
        // Don't fail the entire registration for children data error
        console.log('Warning: Failed to save children data, but parent registration succeeded')
      }
    }

    // Send notification email to admin
    try {
      await sendParentRegistrationNotification({
        parentName: `${parsed.data.firstName} ${parsed.data.lastName}`,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        childrenCount: parsed.data.children?.length || 0,
        userId: userId
      })
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail registration for email errors
    }

    return NextResponse.json({ 
      success: true, 
      id: userId,
      message: 'Parent registered successfully' 
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
