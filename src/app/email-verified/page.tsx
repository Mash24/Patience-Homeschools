'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import AuthLayout from '@/components/ui/AuthLayout'

function EmailVerificationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(3)

  const applicationId = searchParams.get('applicationId')
  const email = searchParams.get('email')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push(`/signup?applicationId=${applicationId}&email=${email}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router, applicationId, email])

  return (
    <AuthLayout
      title="Email verified"
      subtitle={email ? `Verified: ${email}` : 'Your email has been verified successfully.'}
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-sage-500/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-sage-500" />
        </div>
        <p className="text-sm text-ink-muted">
          Redirecting to complete your registration in {countdown}s...
        </p>
        <button
          onClick={() => router.push(`/signup?applicationId=${applicationId}&email=${email}`)}
          className="btn-primary w-full"
        >
          Continue to Registration
          <ArrowRight className="h-4 w-4" />
        </button>
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

export default function EmailVerificationSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmailVerificationContent />
    </Suspense>
  )
}
