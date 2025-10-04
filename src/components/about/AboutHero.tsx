'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Award, BookOpen } from 'lucide-react'

export default function AboutHero() {
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
              About Nelimac Learning
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're passionate about providing quality education and creating meaningful 
              connections between families and qualified teachers in Nairobi.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="font-medium text-gray-900">Passion</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-900">Community</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Award className="h-6 w-6 text-green-600" />
              <span className="font-medium text-gray-900">Excellence</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span className="font-medium text-gray-900">Learning</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

