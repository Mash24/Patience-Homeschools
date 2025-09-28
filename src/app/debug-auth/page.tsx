'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DebugAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [applicationId, setApplicationId] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      addLog('Checking current user...')
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        addLog(`Error getting user: ${error.message}`)
      } else if (user) {
        addLog(`User found: ${user.email}`)
        addLog(`Password set: ${user.user_metadata?.password_set}`)
        addLog(`ApplicationId in metadata: ${user.user_metadata?.applicationId}`)
        setUser(user)
      } else {
        addLog('No user found')
      }
    } catch (err) {
      addLog(`Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const sendTestMagicLink = async () => {
    if (!email) {
      addLog('Please enter an email address')
      return
    }

    try {
      addLog(`Sending magic link to: ${email}`)
      const redirectUrl = `${window.location.origin}/auth/callback?applicationId=${applicationId || 'test-app-id'}`
      addLog(`Redirect URL: ${redirectUrl}`)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            applicationId: applicationId || 'test-app-id'
          }
        }
      })

      if (error) {
        addLog(`Error sending magic link: ${error.message}`)
      } else {
        addLog('Magic link sent successfully! Check your email.')
        addLog(`Data: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      addLog(`Error: ${err}`)
    }
  }

  const signOut = async () => {
    try {
      addLog('Signing out...')
      await supabase.auth.signOut()
      setUser(null)
      addLog('Signed out successfully')
    } catch (err) {
      addLog(`Error signing out: ${err}`)
    }
  }

  const testRedirect = () => {
    const redirectUrl = `/signup?applicationId=${applicationId || 'test-app-id'}&email=${email || 'test@example.com'}`
    addLog(`Testing redirect to: ${redirectUrl}`)
    window.location.href = redirectUrl
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth Debug Page</h1>
        
        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
              <p><strong>NEXT_PUBLIC_APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || '❌ Missing'}</p>
              <p><strong>NEXT_PUBLIC_SITE_URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || '❌ Missing'}</p>
            </div>
            <div>
              <p><strong>Current Origin:</strong> {window.location.origin}</p>
              <p><strong>Current Path:</strong> {window.location.pathname}</p>
              <p><strong>Current Search:</strong> {window.location.search}</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Password Set:</strong> {user.user_metadata?.password_set ? 'Yes' : 'No'}</p>
              <p><strong>ApplicationId:</strong> {user.user_metadata?.applicationId || 'None'}</p>
              <p><strong>Role:</strong> {user.user_metadata?.role || 'None'}</p>
              <button
                onClick={signOut}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <p className="text-gray-600">No user signed in</p>
          )}
        </div>

        {/* Test Magic Link */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Magic Link</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application ID (optional)
              </label>
              <input
                type="text"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter application ID"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={sendTestMagicLink}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send Magic Link
              </button>
              <button
                onClick={testRedirect}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Test Redirect to Signup
              </button>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Try sending a magic link or checking user status.</p>
            ) : (
              logs.map((log, index) => (
                <p key={index} className="text-sm font-mono text-gray-800 mb-1">
                  {log}
                </p>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  )
}
