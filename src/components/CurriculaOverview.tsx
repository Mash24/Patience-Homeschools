'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Globe, BookOpen, Award } from 'lucide-react'

const curricula = [
  {
    name: 'CBC (Competency Based Curriculum)',
    description: 'Kenya\'s new education system focusing on competencies and skills development',
    icon: GraduationCap,
    features: ['Competency-based learning', 'Continuous assessment', 'Local context integration', 'Skills development'],
    color: 'blue'
  },
  {
    name: 'IGCSE (International General Certificate)',
    description: 'Internationally recognized qualification for 14-16 year olds',
    icon: Globe,
    features: ['International recognition', 'Flexible subject choices', 'Practical assessments', 'University preparation'],
    color: 'green'
  },
  {
    name: 'British Curriculum',
    description: 'Traditional British education system with structured progression',
    icon: BookOpen,
    features: ['Structured progression', 'GCSE preparation', 'A-Level foundation', 'UK university pathway'],
    color: 'purple'
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600'
}

export default function CurriculaOverview() {
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
            Supporting All Major Curricula
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our qualified teachers are experts in Kenya's most popular curricula, 
            ensuring your child receives the best education tailored to their needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {curricula.map((curriculum, index) => (
            <motion.div
              key={curriculum.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-center mb-6">
                <div className={`inline-flex p-4 rounded-full ${colorClasses[curriculum.color as keyof typeof colorClasses]} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <curriculum.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {curriculum.name}
                </h3>
                <p className="text-gray-600">
                  {curriculum.description}
                </p>
              </div>

              <ul className="space-y-2">
                {curriculum.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="w-full btn-outline text-sm">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not Sure Which Curriculum is Right?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our education consultants can help you choose the best curriculum for your child's 
              learning style and future goals. Book a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Free Consultation
              </button>
              <button className="btn-outline">
                Compare Curricula
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
