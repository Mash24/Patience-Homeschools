'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const qp = useSearchParams()
  const redirectTo = qp.get('redirectTo') ?? '/admin'

  useEffect(() => {
    const run = async () => {
      console.log('Auth callback - handling authentication...')
      console.log('Current URL:', window.location.href)
      
      try {
        // First, try to exchange PKCE code for session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        
        if (error) {
          console.log('PKCE exchange failed:', error.message)
          
          // If PKCE fails, try to get existing session
          console.log('Trying to get existing session...')
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            console.log('Found existing session:', session.user.email)
            handleSuccess(session.user)
            return
          }
          
          // If no session, redirect to login
          console.log('No session found, redirecting to login')
          router.replace('/login?error=no-session')
          return
        }

        console.log('PKCE exchange successful!')

        // Verify session now exists
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.error('No user after code exchange')
          router.replace('/login?error=no-user')
          return
        }

        console.log('User authenticated:', user.email)
        handleSuccess(user)
        
      } catch (err) {
        console.error('Unexpected error:', err)
        router.replace('/login?error=unexpected')
      }
    }
    
    run()
  }, [router, redirectTo])

  const handleSuccess = (user: any) => {
    const role = user.app_metadata?.role || user.user_metadata?.role
    console.log('User role:', role)

    // Always allowlist your redirect
    const allowed = new Set(['/', '/admin', '/teacher/dashboard', '/parent/dashboard'])
    const finalRedirect = allowed.has(redirectTo) ? redirectTo : '/admin'
    
    console.log('Redirecting to:', finalRedirect)
    router.replace(finalRedirect)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium text-gray-900">Signing you in...</span>
        </div>
        <p className="text-sm text-gray-500">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  )
}
