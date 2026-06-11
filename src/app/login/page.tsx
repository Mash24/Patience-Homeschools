'use client'

import { useState, Suspense } from 'react'
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { sendMagicLink } from './actions'
import AuthLayout from '@/components/ui/AuthLayout'
import Link from 'next/link'

const inputClass =
  'w-full pl-10 pr-4 py-3 bg-ivory border border-ink/10 rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition-all'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/teacher/dashboard'

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await sendMagicLink(email, redirectTo)
      setIsEmailSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <AuthLayout title="Check your email" subtitle={`We sent a magic link to ${email}`}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-gold-600" />
          </div>
          <p className="text-sm text-ink-muted">
            Click the link in your email to sign in. It expires in 1 hour.
          </p>
          <button
            onClick={() => { setIsEmailSent(false); setEmail('') }}
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
      title="Teacher Portal"
      subtitle="Sign in with a magic link — no password needed"
      footer={
        <p>
          New here?{' '}
          <Link href="/teacher-apply" className="text-gold-600 hover:text-gold-700 font-medium">
            Apply to teach
          </Link>
          {' · '}
          <Link href="/signin" className="text-gold-600 hover:text-gold-700 font-medium">
            Password sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              className={inputClass}
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full py-3 bg-gold-500 text-ink font-semibold rounded-full hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Magic Link
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-ink/5 space-y-2 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-sage-500" />
          TSC-certified educators only
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-sage-500" />
          Secure, passwordless authentication
        </div>
      </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  )
}
