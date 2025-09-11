'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Users, BookOpen, Award, Lightbulb } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Passion for Education',
    description: 'We believe every child deserves access to quality education that nurtures their unique potential and learning style.',
    color: 'red'
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'All our teachers are TSC-certified and background-checked, ensuring a safe and secure learning environment.',
    color: 'blue'
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'We foster connections between families, teachers, and students, creating a supportive learning community.',
    color: 'green'
  },
  {
    icon: BookOpen,
    title: 'Excellence in Teaching',
    description: 'We maintain high standards by working only with qualified, experienced teachers who are passionate about education.',
    color: 'purple'
  },
  {
    icon: Award,
    title: 'Continuous Improvement',
    description: 'We constantly evolve our platform and services based on feedback from our community and educational best practices.',
    color: 'orange'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We embrace new technologies and teaching methods to enhance the learning experience for all our students.',
    color: 'yellow'
  }
]

const colorClasses = {
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  yellow: 'bg-yellow-100 text-yellow-600'
}

export default function OurValues() {
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
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These values guide everything we do and shape the experience we create 
            for families, teachers, and students in our community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`inline-flex p-4 rounded-full ${colorClasses[value.color as keyof typeof colorClasses]} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Commitment to You
              </h3>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We are committed to providing exceptional educational services that meet 
                  the unique needs of every family in our community. Our values aren't just 
                  words on a page – they're the foundation of everything we do.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600">TSC Certified Teachers</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Community Support</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">Free</div>
                    <div className="text-sm text-gray-600">Learning Resources</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

