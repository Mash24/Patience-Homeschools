'use client'

import Link from 'next/link'
import { Shield, Home, LogIn } from 'lucide-react'
import AuthLayout from '@/components/ui/AuthLayout'

export default function UnauthorizedPage() {
  return (
    <AuthLayout
      title="Access denied"
      subtitle="You don't have permission to view this page. Sign in with the correct account or contact support."
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-red-500" />
        </div>
        <div className="space-y-3">
          <Link
            href="/signin"
            className="btn-primary w-full"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
          <Link
            href="/"
            className="btn-outline w-full"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>
        <p className="text-xs text-ink-muted">
          Need help?{' '}
          <a href="mailto:support@nelimaclearning.co.ke" className="text-gold-600 hover:text-gold-700">
            support@nelimaclearning.co.ke
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}
