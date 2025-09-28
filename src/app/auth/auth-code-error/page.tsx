'use client'

import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthCodeErrorPage() {
  useEffect(() => {
    // Check if user is authenticated and redirect appropriately
    const handleRedirect = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('No authenticated user, staying on error page')
          return
        }

        console.log('User found:', user.email)
        console.log('User metadata:', user.user_metadata)
        
        // Get applicationId from user metadata
        const applicationId = user.user_metadata?.applicationId
        
        if (applicationId) {
          console.log('Redirecting to email verification success with applicationId:', applicationId)
          window.location.href = `/email-verified?applicationId=${applicationId}&email=${user.email}`
        } else if (!user.user_metadata?.password_set) {
          console.log('Redirecting to signup without applicationId')
          window.location.href = `/signup?email=${user.email}`
        } else {
          console.log('User has password, redirecting to dashboard')
          window.location.href = '/dashboard'
        }
      } catch (err) {
        console.error('Error in redirect logic:', err)
      }
    }

    // Small delay to ensure Supabase client is ready
    setTimeout(handleRedirect, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Authentication...
          </h1>
          <p className="text-gray-600">
            Please wait while we redirect you to the correct page.
          </p>
        </div>

        <div className="text-xs text-gray-500">
          <p>If you're not redirected automatically, please:</p>
          <p className="mt-2">
            <a href="/signup" className="text-blue-600 hover:underline">
              Click here to continue
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}