import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

// Handle password reset for existing users
export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (action === 'reset-password') {
      // Send password reset email
      const { data, error } = await supabaseServer.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      })

      if (error) {
        console.error('Error sending password reset:', error)
        return NextResponse.json(
          { error: 'Failed to send password reset email' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset email sent successfully'
      })
    }

    if (action === 'check-user') {
      // Check if user exists and get their status
      const { data: userData, error: userError } = await supabaseServer.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        filter: `email.eq.${email}`
      })
      
      if (userError) {
        console.error('Error checking auth user:', userError)
        return NextResponse.json(
          { error: 'Failed to check user status' },
          { status: 500 }
        )
      }
      
      if (!userData || !userData.users || userData.users.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const user = userData.users[0]

      // Get teacher application status
      const { data: teacherData, error: teacherError } = await supabaseServer
        .from('teachers')
        .select('id, full_name, email, status, application_date, created_at')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            emailConfirmed: user.email_confirmed_at ? true : false,
            createdAt: user.created_at
          },
          teacherApplication: teacherData ? {
            id: teacherData.id,
            fullName: teacherData.full_name,
            email: teacherData.email,
            status: teacherData.status,
            applicationDate: teacherData.application_date || teacherData.created_at
          } : {
            id: user.id,
            fullName: user.user_metadata?.full_name || 'Unknown',
            email: user.email,
            status: 'pending',
            applicationDate: user.created_at
          }
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in duplicate application handler:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
