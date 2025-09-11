'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, DollarSign, Shield, Clock, Award } from 'lucide-react'

export default function TeacherApplyHero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Join Our Team of
              <span className="text-green-600 block">Expert Teachers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Share your expertise with Nairobi's homeschooling community. 
              Connect with families who value quality education and make a meaningful impact.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span className="font-medium text-gray-900">Competitive Rates</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-900">Flexible Schedule</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="font-medium text-gray-900">Secure Platform</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">Active Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">200+</div>
              <div className="text-sm text-gray-600">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">KSh 2,500</div>
              <div className="text-sm text-gray-600">Avg. Hourly Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

