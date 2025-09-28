import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { claimTeacherApplication } from '@/lib/teacher-application-actions'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const applicationId = searchParams.get('applicationId')
  const redirectTo = searchParams.get('redirectTo') || '/'

  console.log('Auth callback - Code:', !!code, 'ApplicationId:', applicationId, 'Origin:', origin)
  console.log('Full URL:', request.url)
  console.log('All search params:', Object.fromEntries(searchParams.entries()))

  const supabase = await createClient()

  // Handle authorization code flow
  if (code) {
    console.log('Processing authorization code...')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Exchange result - Error:', error?.message, 'Data:', !!data)
    
    if (error) {
      console.error('Code exchange failed:', error)
      // Try to get user anyway in case the session was created
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      if (!getUserError && user) {
        console.log('User found despite exchange error:', user?.email)
        return handleUserRedirect(user, applicationId, origin)
      }
    } else {
      // Get the user after successful authentication
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      
      console.log('User authenticated via code:', user?.email, 'Password set:', user?.user_metadata?.password_set)
      
      if (user) {
        return handleUserRedirect(user, applicationId, origin)
      } else if (getUserError) {
        console.error('Failed to get user after successful exchange:', getUserError)
      }
    }
  } else {
    console.log('No code provided, checking existing session...')
    // Handle implicit flow (access_token in URL fragment)
    // Check if user is already authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (!error && user) {
      console.log('User authenticated via token:', user?.email, 'Password set:', user?.user_metadata?.password_set)
      return handleUserRedirect(user, applicationId, origin)
    } else if (error) {
      console.error('Failed to get user from session:', error)
    }
  }

  // If we get here, authentication failed
  console.log('Authentication failed, redirecting to error page')
  console.log('Final state - Code:', !!code, 'ApplicationId:', applicationId)
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)

  // Helper function to handle user redirect logic
  async function handleUserRedirect(user: any, applicationId: string | null, origin: string) {
    // Get applicationId from URL params or user metadata
    const appId = applicationId || user.user_metadata?.applicationId
    
    console.log('ApplicationId from URL:', applicationId, 'ApplicationId from metadata:', user.user_metadata?.applicationId)
    
    // Check if this is a teacher application claim
    if (appId) {
      // Always redirect to signup page for teacher applications
      console.log('Redirecting to signup with applicationId:', appId)
      return NextResponse.redirect(`${origin}/signup?applicationId=${appId}&email=${user.email}`)
    } else {
      // No applicationId - check if this is a new user who needs password setup
      if (!user.user_metadata?.password_set) {
        // Check if this user has a provisional application
        const { data: provisionalApp } = await supabase
          .from('provisional_applications')
          .select('id')
          .eq('email', user.email)
          .order('application_date', { ascending: false })
          .limit(1)
          .single()

        if (provisionalApp) {
          // Redirect to signup with application ID
          console.log('Redirecting to signup with provisional application:', provisionalApp.id)
          return NextResponse.redirect(`${origin}/signup?applicationId=${provisionalApp.id}&email=${user.email}`)
        } else {
          // No provisional application, redirect to general signup
          console.log('Redirecting to signup without application')
          return NextResponse.redirect(`${origin}/signup?email=${user.email}`)
        }
      }
    }

    // Check if user has a profile, if not create one
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      // Create default profile based on user metadata
      const role = user.user_metadata?.role || 'teacher'
      await supabase
        .from('profiles')
        .insert({
          id: user.id,
          role: role,
          full_name: user.user_metadata?.full_name || '',
          email: user.email,
        })
    }
    
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }
}
