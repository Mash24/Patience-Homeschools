'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@patiencehomeschools.co.ke',
    description: 'Send us an email and we\'ll respond within 24 hours',
    color: 'blue'
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+254 XXX XXX XXX',
    description: 'Speak directly with our team during business hours',
    color: 'green'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'Nairobi, Kenya',
    description: 'Located in the heart of Nairobi',
    color: 'orange'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    details: '+254 XXX XXX XXX',
    description: 'Quick responses via WhatsApp',
    color: 'green'
  }
]

const businessHours = [
  { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600'
}

export default function ContactInfo() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Contact Information
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the most convenient way to reach us. We're here to help with 
            any questions about our services or support.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`inline-flex p-4 rounded-full ${colorClasses[method.color as keyof typeof colorClasses]} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                {method.details}
              </p>
              <p className="text-gray-600 text-sm">
                {method.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Business Hours
            </h3>
            <div className="space-y-4">
              {businessHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="font-medium text-gray-900">{schedule.day}</span>
                  <span className="text-gray-600">{schedule.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                For urgent matters outside business hours, please send us an email 
                and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

