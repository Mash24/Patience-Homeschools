'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Star, Clock, Users, Globe } from 'lucide-react'

export default function CurriculumComparison() {
  const comparisonData = [
    {
      feature: 'International Recognition',
      cbc: { value: 'National', icon: CheckCircle, color: 'text-green-600' },
      igcse: { value: 'Global', icon: CheckCircle, color: 'text-green-600' },
      british: { value: 'Global', icon: CheckCircle, color: 'text-green-600' }
    },
    {
      feature: 'Assessment Method',
      cbc: { value: 'Competency-based', icon: CheckCircle, color: 'text-green-600' },
      igcse: { value: 'Examination-based', icon: CheckCircle, color: 'text-green-600' },
      british: { value: 'Continuous + Exams', icon: CheckCircle, color: 'text-green-600' }
    },
    {
      feature: 'Subject Flexibility',
      cbc: { value: 'Structured', icon: CheckCircle, color: 'text-green-600' },
      igcse: { value: 'High', icon: CheckCircle, color: 'text-green-600' },
      british: { value: 'Moderate', icon: CheckCircle, color: 'text-green-600' }
    },
    {
      feature: 'Digital Integration',
      cbc: { value: 'High', icon: CheckCircle, color: 'text-green-600' },
      igcse: { value: 'Moderate', icon: CheckCircle, color: 'text-green-600' },
      british: { value: 'Moderate', icon: CheckCircle, color: 'text-green-600' }
    },
    {
      feature: 'University Preparation',
      cbc: { value: 'Good', icon: CheckCircle, color: 'text-green-600' },
      igcse: { value: 'Excellent', icon: CheckCircle, color: 'text-green-600' },
      british: { value: 'Excellent', icon: CheckCircle, color: 'text-green-600' }
    },
    {
      feature: 'Local Context',
      cbc: { value: 'High', icon: CheckCircle, color: 'text-green-600' },
      igcse: { value: 'Moderate', icon: CheckCircle, color: 'text-green-600' },
      british: { value: 'Low', icon: CheckCircle, color: 'text-green-600' }
    },
    {
      feature: 'Duration',
      cbc: { value: '12 years', icon: Clock, color: 'text-blue-600' },
      igcse: { value: '2-4 years', icon: Clock, color: 'text-blue-600' },
      british: { value: '13 years', icon: Clock, color: 'text-blue-600' }
    },
    {
      feature: 'Teacher Availability',
      cbc: { value: 'High', icon: Users, color: 'text-green-600' },
      igcse: { value: 'Moderate', icon: Users, color: 'text-yellow-600' },
      british: { value: 'Moderate', icon: Users, color: 'text-yellow-600' }
    }
  ]

  const curricula = [
    {
      name: 'CBC',
      fullName: 'Competency Based Curriculum',
      color: 'from-green-500 to-green-600',
      description: 'Kenya\'s innovative curriculum',
      bestFor: 'Local university preparation, holistic development'
    },
    {
      name: 'IGCSE',
      fullName: 'International General Certificate',
      color: 'from-blue-500 to-blue-600',
      description: 'Internationally recognized qualification',
      bestFor: 'International universities, global mobility'
    },
    {
      name: 'British',
      fullName: 'British Curriculum',
      color: 'from-purple-500 to-purple-600',
      description: 'Traditional British education',
      bestFor: 'UK universities, traditional academic rigor'
    }
  ]

  return (
    <section className="py-24 bg-sage-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-6">
            Curriculum
            <span className="text-gradient-gold"> Comparison</span>
          </h2>
          <p className="text-luxury max-w-3xl mx-auto">
            Compare our three premium curriculum options to find the perfect fit for your child's 
            learning style, future goals, and educational preferences.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="font-semibold text-navy-900 text-lg">Features</div>
              {curricula.map((curriculum, index) => (
                <motion.div
                  key={curriculum.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${curriculum.color} mb-3`}>
                    <span className="text-white font-bold text-lg">{curriculum.name}</span>
                  </div>
                  <h3 className="font-semibold text-navy-900 text-lg mb-1">{curriculum.fullName}</h3>
                  <p className="text-sm text-charcoal-600 mb-2">{curriculum.description}</p>
                  <p className="text-xs text-charcoal-500 italic">{curriculum.bestFor}</p>
                </motion.div>
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="space-y-4">
              {comparisonData.map((row, index) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-sage-200 hover:shadow-premium transition-all duration-300"
                >
                  <div className="font-medium text-charcoal-700 flex items-center">
                    {row.feature}
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <row.cbc.icon className={`h-5 w-5 ${row.cbc.color}`} />
                      <span className="text-sm font-medium text-charcoal-700">{row.cbc.value}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <row.igcse.icon className={`h-5 w-5 ${row.igcse.color}`} />
                      <span className="text-sm font-medium text-charcoal-700">{row.igcse.value}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <row.british.icon className={`h-5 w-5 ${row.british.color}`} />
                      <span className="text-sm font-medium text-charcoal-700">{row.british.value}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="mt-16">
          <div className="card-luxury">
            <div className="text-center space-y-6">
              <h3 className="heading-sm">Still Not Sure Which Curriculum to Choose?</h3>
              <p className="text-luxury max-w-2xl mx-auto">
                Our education consultants are here to help you make the best decision for your child's 
                future. Schedule a free consultation to discuss your options and get personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  Schedule Free Consultation
                </button>
                <button className="btn-outline">
                  Download Comparison Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}