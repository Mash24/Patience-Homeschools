'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import AuthLayout from '@/components/ui/AuthLayout'
import Link from 'next/link'

const inputClass =
  'w-full pl-10 pr-4 py-3 bg-ivory border border-ink/10 rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition-all'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) setEmail(decodeURIComponent(emailParam))
  }, [searchParams])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        setSuccess('Sign in successful! Redirecting...')
        const role = data.user.app_metadata?.role || data.user.user_metadata?.role

        setTimeout(() => {
          if (role === 'admin') router.replace('/admin')
          else if (role === 'teacher') router.replace('/teacher/dashboard')
          else router.replace('/teacher-apply')
        }, 800)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setIsResetting(true)
    setError('')
    setSuccess('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setSuccess('Password reset email sent! Check your inbox.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Nelimac account"
      footer={
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/teacher-apply" className="text-gold-600 hover:text-gold-700 font-medium">
            Apply as a teacher
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-12`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted/60 hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-gold-50 border border-gold-200 rounded-xl text-sm text-gold-800">
            <CheckCircle className="h-5 w-5 shrink-0" />
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gold-500 text-ink font-semibold rounded-full hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={isResetting || !email}
          className="w-full py-3 text-sm font-medium text-ink-muted hover:text-ink transition-colors disabled:opacity-50"
        >
          {isResetting ? 'Sending reset email...' : 'Forgot password?'}
        </button>
      </form>
    </AuthLayout>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  )
}
