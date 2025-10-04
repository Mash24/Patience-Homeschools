'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Shield, Users, CheckCircle, Sparkles } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendMagicLink } from './actions'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin'

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await sendMagicLink(email, redirectTo)
      setIsEmailSent(true)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Mail className="h-8 w-8 text-green-600" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Click the link in your email to sign in. The link will expire in 1 hour.
            </p>
            
            <button
              onClick={() => {
                setIsEmailSent(false)
                setEmail('')
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Use a different email
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Nelimac Learning</h1>
              <p className="text-sm text-gray-600">Teacher Portal</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Welcome to the
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Teacher Portal
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join Nairobi's premier education network and connect with families seeking quality education.
              </p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Access</h3>
                  <p className="text-gray-600">Passwordless authentication with magic links for enhanced security.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Teachers</h3>
                  <p className="text-gray-600">TSC-certified educators with verified credentials and experience.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Platform</h3>
                  <p className="text-gray-600">Intuitive dashboard with real-time updates and seamless experience.</p>
                </div>
              </motion.div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Ready to Get Started?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Sign in with your email to access your teacher dashboard, manage your profile, and connect with families.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>✓ No passwords required</span>
                <span>•</span>
                <span>✓ Secure magic links</span>
                <span>•</span>
                <span>✓ Instant access</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your email to receive a magic link</p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Magic Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                New to Nelimac Learning?{' '}
                <button
                  onClick={() => router.push('/teacher-apply')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Apply to Teach
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center space-x-3">
          <Mail className="h-6 w-6 animate-pulse text-blue-600" />
          <span className="text-lg font-medium text-gray-900">Loading login...</span>
        </div>
      </motion.div>
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
