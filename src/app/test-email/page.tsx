'use client'

import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function sendMagicLink() {
    if (!email) {
      setStatus('Please enter an email address')
      return
    }

    setLoading(true)
    setStatus('Sending magic link...')

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        }
      })

      if (error) {
        setStatus(`❌ ERROR: ${error.message}`)
        console.error('Magic link error:', error)
      } else {
        setStatus('✅ Magic link sent! Check your email (including spam folder)')
        console.log('Magic link data:', data)
      }
    } catch (err) {
      setStatus(`❌ Unexpected error: ${err}`)
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Test Magic Link Email
        </h1>
        
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

          <button
            onClick={sendMagicLink}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>

          {status && (
            <div className={`p-3 rounded-md text-sm ${
              status.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status}
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Environment Check:</strong></p>
            <p>• NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p>• NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p>• NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || '❌ Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
