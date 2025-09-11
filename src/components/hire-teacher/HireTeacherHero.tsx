'use client'

import { motion } from 'framer-motion'
import { Users, CheckCircle, Clock, Shield } from 'lucide-react'

export default function HireTeacherHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-orange-50 section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Find the Perfect Teacher
              <span className="text-blue-600 block">for Your Child</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with qualified, TSC-certified teachers who specialize in CBC, IGCSE, 
              and British curricula. Our matching system ensures the perfect fit for your family's needs.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="font-medium text-gray-900">TSC Certified</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-900">Background Checked</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Clock className="h-6 w-6 text-orange-600" />
              <span className="font-medium text-gray-900">Quick Matching</span>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Qualified Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24hrs</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Curricula Supported</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

