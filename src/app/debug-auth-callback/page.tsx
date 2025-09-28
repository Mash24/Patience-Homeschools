'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthCallbackDebugPage() {
  const searchParams = useSearchParams()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      const info = {
        url: window.location.href,
        searchParams: {
          code: searchParams.get('code'),
          applicationId: searchParams.get('applicationId'),
          email: searchParams.get('email'),
          error: searchParams.get('error'),
          error_description: searchParams.get('error_description')
        },
        user: user ? {
          id: user.id,
          email: user.email,
          password_set: user.user_metadata?.password_set,
          setup_completed: user.user_metadata?.setup_completed,
          metadata: user.user_metadata
        } : null
      }
      
      setDebugInfo(info)
      console.log('Auth Callback Debug Info:', info)
    }
    
    checkAuth()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Auth Callback Debug
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          
          {debugInfo && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Current URL:</h3>
              <p className="text-sm text-gray-600 break-all">{debugInfo?.url}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">User Status:</h3>
              <div className="text-sm space-y-1">
                <p>• Authenticated: {user ? '✅ Yes' : '❌ No'}</p>
                <p>• Email: {user?.email || 'N/A'}</p>
                <p>• Password Set: {user?.user_metadata?.password_set ? '✅ Yes' : '❌ No'}</p>
                <p>• Setup Completed: {user?.user_metadata?.setup_completed ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Expected Flow:</h3>
              <div className="text-sm space-y-1">
                <p>1. Magic link clicked → Auth callback</p>
                <p>2. User authenticated → Check password_set</p>
                <p>3. If no password → Redirect to /setup-password</p>
                <p>4. If password exists → Redirect to /teacher/dashboard</p>
              </div>
            </div>

            {debugInfo?.searchParams?.applicationId && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Application ID Found:</h3>
                <p className="text-blue-800">{debugInfo.searchParams.applicationId}</p>
                <p className="text-sm text-blue-700 mt-2">
                  This should trigger the password setup flow.
                </p>
              </div>
            )}

            {debugInfo?.searchParams?.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Error Detected:</h3>
                <p className="text-red-800">Error: {debugInfo.searchParams.error}</p>
                <p className="text-red-800">Description: {debugInfo.searchParams.error_description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
