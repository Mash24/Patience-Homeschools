'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import AuthLayout from '@/components/ui/AuthLayout'
import Link from 'next/link'

const inputClass =
  'w-full px-4 py-3 bg-ivory border border-ink/10 rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition-all'

export default function AdminSignIn() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        return
      }

      const role = data.user?.app_metadata?.role || data.user?.user_metadata?.role
      if (role === 'admin') {
        router.replace('/admin')
      } else {
        setError('Access denied. Admin privileges required.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Admin Sign In"
      subtitle="Access the Nelimac admin dashboard"
      footer={
        <Link href="/signin" className="text-gold-600 hover:text-gold-700 font-medium">
          Teacher or parent sign in →
        </Link>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="admin@nelimaclearning.co.ke"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gold-500 text-ink font-semibold rounded-full hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  )
}
