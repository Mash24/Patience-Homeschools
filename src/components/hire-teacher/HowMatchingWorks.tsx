'use client'

import { motion } from 'framer-motion'
import { Search, Users, CheckCircle, Star, Clock, Shield } from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Submit Your Requirements',
    description: 'Fill out our detailed form with your child\'s needs, curriculum, subjects, and preferences.',
    icon: Search,
    color: 'blue',
    details: ['Child\'s age and grade level', 'Preferred curriculum (CBC/IGCSE/British)', 'Required subjects', 'Schedule preferences', 'Location and budget']
  },
  {
    step: 2,
    title: 'AI-Powered Matching',
    description: 'Our system analyzes your requirements and matches you with 3 qualified teachers.',
    icon: Users,
    color: 'green',
    details: ['TSC certification verification', 'Curriculum expertise matching', 'Subject specialization', 'Location compatibility', 'Schedule availability']
  },
  {
    step: 3,
    title: 'Review Teacher Profiles',
    description: 'Review detailed profiles, qualifications, experience, and parent reviews.',
    icon: CheckCircle,
    color: 'purple',
    details: ['Teaching qualifications', 'Years of experience', 'Previous parent reviews', 'Teaching philosophy', 'Sample lesson plans']
  },
  {
    step: 4,
    title: 'Choose & Start Learning',
    description: 'Select your preferred teacher and begin your personalized learning journey.',
    icon: Star,
    color: 'orange',
    details: ['Schedule initial meeting', 'Set learning goals', 'Begin regular sessions', 'Track progress', 'Ongoing support']
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
}

const features = [
  {
    icon: Shield,
    title: 'TSC Certified Teachers',
    description: 'All teachers are verified TSC members with valid teaching certificates'
  },
  {
    icon: Clock,
    title: '24-Hour Response',
    description: 'Get teacher recommendations within 24 hours of submitting your request'
  },
  {
    icon: Star,
    title: 'Quality Guarantee',
    description: '100% satisfaction guarantee - we\'ll find a replacement if you\'re not happy'
  }
]

export default function HowMatchingWorks() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How Our Matching Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent matching system ensures you find the perfect teacher 
            for your child's unique learning needs and preferences.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-300 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              )}

              <div className="card text-center hover:shadow-xl transition-all duration-300 relative z-10">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-full ${colorClasses[step.color as keyof typeof colorClasses]} mb-4 mt-4`}>
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {step.description}
                </p>

                {/* Details */}
                <ul className="text-left space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Teacher?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of families who have found their ideal homeschooling solution 
              through our platform.
            </p>
            <button className="btn-primary">
              Start Your Search Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

