'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestRedirectPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error getting user:', error)
        setLoading(false)
        return
      }

      setUser(user)
      console.log('Current user:', user)
      
      if (user) {
        console.log('User metadata:', user.user_metadata)
        console.log('ApplicationId in metadata:', user.user_metadata?.applicationId)
        
        // If user has applicationId in metadata, redirect to signup
        if (user.user_metadata?.applicationId) {
          console.log('Redirecting to signup with applicationId from metadata')
          window.location.href = `/signup?applicationId=${user.user_metadata.applicationId}&email=${user.email}`
        } else if (!user.user_metadata?.password_set) {
          console.log('Redirecting to signup without applicationId')
          window.location.href = `/signup?email=${user.email}`
        } else {
          console.log('User already has password set, redirecting to dashboard')
          window.location.href = '/dashboard'
        }
      }
    } catch (err) {
      console.error('Error checking user:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Test Redirect Logic
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          
          {user ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Password Set:</p>
                <p className="font-medium">{user.user_metadata?.password_set ? 'Yes' : 'No'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">ApplicationId in Metadata:</p>
                <p className="font-medium">{user.user_metadata?.applicationId || 'None'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Full Metadata:</p>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(user.user_metadata, null, 2)}
                </pre>
              </div>
              
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => window.location.href = `/signup?applicationId=${user.user_metadata?.applicationId}&email=${user.email}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Go to Signup Page
                </button>
                
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No user authenticated</p>
          )}
        </div>
      </div>
    </div>
  )
}
