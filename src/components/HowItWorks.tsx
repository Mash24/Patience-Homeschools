'use client'

import { motion } from 'framer-motion'
import { Search, Users, CheckCircle, Star } from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Submit Your Requirements',
    description: 'Tell us about your child\'s needs, preferred curriculum, subjects, and schedule.',
    icon: Search,
    color: 'blue'
  },
  {
    step: 2,
    title: 'Get Matched with Teachers',
    description: 'We\'ll show you 3 qualified teachers who match your requirements perfectly.',
    icon: Users,
    color: 'green'
  },
  {
    step: 3,
    title: 'Review & Choose',
    description: 'Review teacher profiles, qualifications, and choose the best fit for your family.',
    icon: CheckCircle,
    color: 'purple'
  },
  {
    step: 4,
    title: 'Start Learning',
    description: 'Begin your homeschooling journey with expert guidance and support.',
    icon: Star,
    color: 'orange'
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
}

export default function HowItWorks() {
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Getting started with Patience Home Schools is simple. Follow these four easy steps 
            to find the perfect teacher for your child.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of families who have found their perfect homeschooling solution 
              through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Find a Teacher Now
              </button>
              <button className="btn-outline">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
