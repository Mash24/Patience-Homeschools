'use client'

import { motion } from 'framer-motion'
import { Shield, ArrowLeft, Home, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Shield className="h-12 w-12 text-red-600" />
        </motion.div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. Please sign in with the correct account or contact an administrator.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all w-full justify-center"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In</span>
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all w-full justify-center"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            If you believe this is an error, please contact support at{' '}
            <a href="mailto:support@nelimaclearning.co.ke" className="text-blue-600 hover:text-blue-700">
              support@nelimaclearning.co.ke
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
