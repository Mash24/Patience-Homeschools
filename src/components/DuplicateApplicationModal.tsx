'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Calendar, CheckCircle, Clock, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DuplicateApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  existingApplication: {
    id: string
    fullName: string
    email: string
    status: string
    applicationDate: string
  }
  onSignIn: () => void
}

export default function DuplicateApplicationModal({
  isOpen,
  onClose,
  existingApplication,
  onSignIn,
}: DuplicateApplicationModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
      case 'submitted':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">You Already Have an Account!</h2>
                  <p className="text-amber-100 text-sm mt-1">Welcome back to Nelimac Learning</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Account Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">{existingApplication.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Applied on {formatDate(existingApplication.applicationDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(existingApplication.status)}`}>
                      {getStatusIcon(existingApplication.status)}
                      <span className="ml-1 capitalize">{existingApplication.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Friendly Message */}
              <div className="text-center">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Looks like you've applied before! Please proceed to login to view your profile.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Primary Action - Log In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSignIn}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <User className="h-6 w-6" />
                  <span>Log In Now</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Help Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    If you think this is a mistake, try again.
                  </p>
                  <div className="mt-2">
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center justify-center space-x-1 mx-auto">
                      <HelpCircle className="h-4 w-4" />
                      <span>Need help? Contact support</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}