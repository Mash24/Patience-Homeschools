'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Mail, Clock, ArrowRight, Users, Award, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function TeacherApplicationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nelimac Learning</h1>
                <p className="text-sm text-gray-600">Application Submitted</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Success Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Thank you for your interest in joining Nelimac Learning. Your application has been received and is now under review.
            </p>

            {/* What Happens Next */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Magic Link Email</h3>
                    <p className="text-gray-600">
                      Check your email for a magic link to access your teacher dashboard where you can track your application status.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Process</h3>
                    <p className="text-gray-600">
                      Our team will review your application and documents. This typically takes 2-3 business days.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval & Activation</h3>
                    <p className="text-gray-600">
                      Once approved, you'll receive an email confirmation and your profile will be visible to parents.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Teachers</p>
                    <p className="text-2xl font-bold text-gray-900">50+</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Subjects Covered</p>
                    <p className="text-2xl font-bold text-gray-900">20+</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/hire-teacher"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <span>Browse Teachers</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
              >
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-12 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 mb-4">
                If you have any questions about your application, feel free to reach out to our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a href="mailto:teachers@nelimaclearning.co.ke" className="text-blue-600 hover:text-blue-700">
                  teachers@nelimaclearning.co.ke
                </a>
                <span className="hidden sm:inline text-blue-400">•</span>
                <a href="tel:+254700000000" className="text-blue-600 hover:text-blue-700">
                  +254 700 000 000
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
