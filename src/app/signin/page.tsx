'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import AuthLayout from '@/components/ui/AuthLayout'
import Link from 'next/link'
import { getDashboardPath } from '@/lib/auth-redirect'
import { sendMagicLink } from '@/app/login/actions'

const inputClass =
  'w-full pl-10 pr-4 py-3 bg-ivory border border-ink/10 rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition-all'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'magic' ? 'magic' : 'password'
  const redirectTo = searchParams.get('redirectTo') || ''

  const [tab, setTab] = useState<'password' | 'magic'>(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) setEmail(decodeURIComponent(emailParam))

    const errorParam = searchParams.get('error')
    if (errorParam) {
      const messages: Record<string, string> = {
        'no-session': 'Your sign-in link expired. Please try again.',
        'no-user': 'Could not verify your account. Please try again.',
        unexpected: 'Something went wrong. Please try again.',
      }
      setError(messages[errorParam] || 'Sign in failed. Please try again.')
    }
  }, [searchParams])

  const resolveRedirect = (role?: string) => {
    if (redirectTo && ['/parent/dashboard', '/teacher/dashboard', '/admin'].includes(redirectTo)) {
      return redirectTo
    }
    const path = getDashboardPath(role)
    if (path === '/' && !role) return '/teacher-apply'
    return path
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data.user) {
        const role = (data.user.app_metadata?.role || data.user.user_metadata?.role) as string | undefined
        setSuccess('Sign in successful! Redirecting...')
        setTimeout(() => router.replace(resolveRedirect(role)), 600)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const destination = redirectTo || '/parent/dashboard'
      await sendMagicLink(email, destination)
      setMagicLinkSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetError) setError(resetError.message)
      else setSuccess('Password reset email sent! Check your inbox.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email')
    } finally {
      setIsResetting(false)
    }
  }

  if (magicLinkSent) {
    return (
      <AuthLayout title="Check your email" subtitle={`We sent a sign-in link to ${email}`}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-gold-600" />
          </div>
          <p className="text-sm text-ink-muted">Click the link in your email. It expires in 1 hour.</p>
          <button
            onClick={() => { setMagicLinkSent(false); setEmail('') }}
            className="text-sm text-gold-600 hover:text-gold-700 font-medium"
          >
            ← Use a different email
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Nelimac account"
      footer={
        <p className="text-center">
          New here?{' '}
          <Link href="/hire-teacher" className="text-gold-600 hover:text-gold-700 font-medium">Find a tutor</Link>
          {' · '}
          <Link href="/teacher-apply" className="text-gold-600 hover:text-gold-700 font-medium">Apply to teach</Link>
        </p>
      }
    >
      <div className="flex rounded-xl bg-ivory p-1 mb-6">
        <button
          type="button"
          onClick={() => setTab('password')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'password' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setTab('magic')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'magic' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'
          }`}
        >
          Magic link
        </button>
      </div>

      {tab === 'password' ? (
        <form onSubmit={handlePasswordSignIn} className="space-y-5">
          <div>
            <label className="label-field">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="your.email@example.com" required />
            </div>
          </div>
          <div>
            <label className="label-field">Password</label>
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
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted/60 hover:text-ink">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-gold-50 border border-gold-200 rounded-xl text-sm text-gold-800">
              <CheckCircle className="h-5 w-5 shrink-0" />{success}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Signing in...</> : <>Sign In<ArrowRight className="h-5 w-5" /></>}
          </button>

          <button type="button" onClick={handlePasswordReset} disabled={isResetting || !email} className="w-full py-2 text-sm text-ink-muted hover:text-ink disabled:opacity-50">
            {isResetting ? 'Sending reset email...' : 'Forgot password?'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-5">
          <p className="text-sm text-ink-muted">We&apos;ll email you a secure link — no password needed.</p>
          <div>
            <label className="label-field">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="your.email@example.com" required />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />{error}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Sending...</> : <>Send magic link<ArrowRight className="h-5 w-5" /></>}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-ink-muted">
        Admin?{' '}
        <Link href="/admin-login" className="text-gold-600 hover:text-gold-700 font-medium">Admin sign in</Link>
      </p>
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
