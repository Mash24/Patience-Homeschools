'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'
import { sendTeacherMagicLink } from '@/lib/teacher-application-actions'

interface AccountCreationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  applicationId: string
}

export default function AccountCreationModal({ 
  isOpen, 
  onClose, 
  email, 
  applicationId 
}: AccountCreationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMagicLink = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await sendTeacherMagicLink(email, applicationId)
      
      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || 'Failed to send magic link')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isSuccess ? 'Check Your Email' : 'Create Your Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!isSuccess ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      We'll send a secure sign-in link to:
                    </p>
                    <p className="text-sm text-blue-700 font-mono">{email}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>After clicking the link in your email:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Your application will be linked to your account</li>
                  <li>You'll be able to track your application status</li>
                  <li>You can update documents if needed</li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSendMagicLink}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Magic Link
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Magic Link Sent!
                </h3>
                <p className="text-sm text-gray-600">
                  We've sent a secure sign-in link to <strong>{email}</strong>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-2">What happens next?</h4>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Check your email and click the magic link</li>
                  <li>Your application will be automatically linked to your account</li>
                  <li>You'll be redirected to your teacher dashboard</li>
                  <li>Track your application status and update documents</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
