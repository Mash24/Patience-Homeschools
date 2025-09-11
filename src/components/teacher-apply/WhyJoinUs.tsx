'use client'

import { motion } from 'framer-motion'
import { DollarSign, Users, Clock, Shield, Award, Heart } from 'lucide-react'

const benefits = [
  {
    icon: DollarSign,
    title: 'Competitive Earnings',
    description: 'Earn KSh 1,500 - 3,000 per hour based on your qualifications and experience',
    color: 'green'
  },
  {
    icon: Users,
    title: 'Flexible Schedule',
    description: 'Choose your own hours and work with families that fit your availability',
    color: 'blue'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'All payments are processed securely through our platform with guaranteed payments',
    color: 'purple'
  },
  {
    icon: Clock,
    title: 'Work-Life Balance',
    description: 'Set your own schedule and maintain a healthy work-life balance',
    color: 'orange'
  },
  {
    icon: Award,
    title: 'Professional Growth',
    description: 'Access to training resources and opportunities for professional development',
    color: 'indigo'
  },
  {
    icon: Heart,
    title: 'Make a Difference',
    description: 'Help shape young minds and make a meaningful impact in children\'s education',
    color: 'pink'
  }
]

const colorClasses = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  pink: 'bg-pink-100 text-pink-600'
}

const requirements = [
  'TSC registration number',
  'Bachelor\'s degree or higher in education or related field',
  'Minimum 2 years teaching experience',
  'Certificate of Good Conduct',
  'Passion for teaching and working with children',
  'Reliable internet connection (for online teaching)'
]

export default function WhyJoinUs() {
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
            Why Join Our Team?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Nairobi's most trusted homeschooling platform and become part of a community 
            that values quality education and meaningful connections.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`inline-flex p-4 rounded-full ${colorClasses[benefit.color as keyof typeof colorClasses]} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Requirements to Join
            </h3>
            <ul className="space-y-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h4>
            <p className="text-gray-600 mb-6">
              Complete the application form and join our community of dedicated educators. 
              We'll review your application and get back to you within 48 hours.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Free to join - no registration fees</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Quick approval process</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Ongoing support and training</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What Our Teachers Say
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Working with Patience Home Schools has given me the flexibility to teach 
                while maintaining my work-life balance. The families are wonderful to work with."
              </p>
              <div className="font-semibold text-gray-900">Grace Wanjiku</div>
              <div className="text-sm text-gray-600">Mathematics Teacher, 3 years</div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The platform is well-organized and the support team is always helpful. 
                I've built lasting relationships with the families I teach."
              </p>
              <div className="font-semibold text-gray-900">David Kimani</div>
              <div className="text-sm text-gray-600">English Teacher, 2 years</div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I love the variety of students I get to work with. Each family has unique 
                needs and it keeps my teaching fresh and engaging."
              </p>
              <div className="font-semibold text-gray-900">Sarah Mwangi</div>
              <div className="text-sm text-gray-600">CBC Teacher, 4 years</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

