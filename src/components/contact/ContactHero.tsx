'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactHero() {
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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Have questions about our services? Need help finding the right teacher? 
              We're here to help you every step of the way.
            </p>
          </motion.div>

          {/* Quick Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Mail className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-900">Email Us</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Phone className="h-6 w-6 text-green-600" />
              <span className="font-medium text-gray-900">Call Us</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <MapPin className="h-6 w-6 text-orange-600" />
              <span className="font-medium text-gray-900">Visit Us</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
              <Clock className="h-6 w-6 text-purple-600" />
              <span className="font-medium text-gray-900">24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

