'use client'

import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

export default function EmailDebugPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function testMagicLink() {
    if (!email) {
      setStatus('Please enter an email address')
      return
    }

    setLoading(true)
    setStatus('Testing magic link delivery...')

    try {
      console.log('Environment check:', {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '❌ Missing'
      })

      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      console.log('Redirect URL:', redirectUrl)

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      console.log('Supabase response:', { data, error })

      if (error) {
        setStatus(`❌ ERROR: ${error.message}`)
        setDebugInfo({ error: error.message, code: error.status })
      } else {
        setStatus('✅ Magic link request sent! Check your email (including spam folder)')
        setDebugInfo({ 
          data, 
          redirectUrl,
          timestamp: new Date().toISOString(),
          emailProvider: email.split('@')[1]
        })
      }
    } catch (err) {
      setStatus(`❌ Unexpected error: ${err}`)
      console.error('Unexpected error:', err)
      setDebugInfo({ error: err })
    } finally {
      setLoading(false)
    }
  }

  async function testAdminMagicLink() {
    if (!email) {
      setStatus('Please enter an email address')
      return
    }

    setLoading(true)
    setStatus('Testing admin magic link...')

    try {
      // This would need to be done server-side with service role key
      setStatus('⚠️ Admin magic link test requires server-side implementation')
    } catch (err) {
      setStatus(`❌ Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Email Delivery Debug Tool
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Magic Link Delivery</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={testMagicLink}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Testing...' : 'Test Magic Link'}
                </button>

                <button
                  onClick={testAdminMagicLink}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Test Admin Magic Link
                </button>
              </div>

              {status && (
                <div className={`p-3 rounded-md text-sm ${
                  status.includes('✅') 
                    ? 'bg-green-100 text-green-800' 
                    : status.includes('❌')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </div>
              )}
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Environment Variables:</h3>
                <div className="text-sm space-y-1">
                  <p>• NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
                  <p>• NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
                  <p>• NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || '❌ Missing'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Configuration Check:</h3>
                <div className="text-sm space-y-1">
                  <p>• Redirect URL: {process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` : 'Not configured'}</p>
                  <p>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'}</p>
                </div>
              </div>

              {debugInfo && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Last Test Result:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">1. Check Supabase Configuration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Go to Supabase Dashboard → Authentication → URL Configuration</li>
                <li>• Site URL: <code className="bg-gray-100 px-1 rounded">http://localhost:3000</code></li>
                <li>• Redirect URLs: <code className="bg-gray-100 px-1 rounded">http://localhost:3000/auth/callback</code></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">2. Check Email Provider Settings</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Supabase Dashboard → Authentication → Providers → Email</li>
                <li>• Ensure "Enable Email Provider" is ON</li>
                <li>• Check "Enable Magic Link" is ON</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">3. Check Email Delivery</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check spam/junk folder</li>
                <li>• Try different email providers (Gmail, Yahoo, Outlook)</li>
                <li>• Check Supabase → Authentication → Logs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">4. Common Issues</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Wrong redirect URL in Supabase</li>
                <li>• Email provider blocking Supabase emails</li>
                <li>• Supabase rate limiting</li>
                <li>• Missing environment variables</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
