'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, ArrowRight, Clock } from 'lucide-react'

function EmailVerificationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(3)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const applicationId = searchParams.get('applicationId')
  const email = searchParams.get('email')

  useEffect(() => {
    // Start countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true)
          clearInterval(timer)
          // Redirect to signup page
          router.push(`/signup?applicationId=${applicationId}&email=${email}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, applicationId, email])

  const handleManualRedirect = () => {
    setIsRedirecting(true)
    router.push(`/signup?applicationId=${applicationId}&email=${email}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Email Successfully Verified!
          </h1>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Mail className="h-5 w-5" />
            <span className="font-medium">{email}</span>
          </div>
          
          <p className="text-gray-600">
            Your email has been verified successfully. You can now complete your teacher registration.
          </p>
        </motion.div>

        {/* Countdown and Redirect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          {!isRedirecting ? (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Clock className="h-5 w-5" />
              <span>Redirecting in {countdown} seconds...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>Redirecting...</span>
            </div>
          )}

          {/* Manual Redirect Button */}
          <button
            onClick={handleManualRedirect}
            disabled={isRedirecting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue to Registration</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-xs text-gray-500"
        >
          <p>Next step: Complete your teacher profile and set up your password</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center space-x-3">
          <CheckCircle className="h-6 w-6 animate-pulse text-green-600" />
          <span className="text-lg font-medium text-gray-900">Loading verification...</span>
        </div>
      </motion.div>
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
