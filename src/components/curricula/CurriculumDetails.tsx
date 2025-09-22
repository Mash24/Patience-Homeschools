'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Globe, Award, Clock, CheckCircle, Star } from 'lucide-react'

export default function CurriculumDetails() {
  const curricula = [
    {
      name: 'CBC (Competency Based Curriculum)',
      description: 'Kenya\'s innovative curriculum focusing on developing key competencies and skills for the 21st century.',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      features: [
        'Holistic development approach',
        'Competency-based assessment',
        'Local context integration',
        'Digital literacy focus',
        'Creative thinking emphasis',
        'Collaborative learning'
      ],
      levels: ['Grade 1-8', 'Grade 9-12'],
      duration: '12 years',
      recognition: 'Kenya National Qualifications Framework',
      teachers: 25,
      students: 150,
      rating: 4.8
    },
    {
      name: 'IGCSE (International General Certificate)',
      description: 'Internationally recognized qualification providing excellent preparation for A-Levels and university.',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      features: [
        'International recognition',
        'Flexible subject choices',
        'Rigorous assessment standards',
        'University preparation',
        'Critical thinking focus',
        'Global perspective'
      ],
      levels: ['Grade 9-10', 'Grade 11-12'],
      duration: '2-4 years',
      recognition: 'Cambridge International',
      teachers: 15,
      students: 80,
      rating: 4.9
    },
    {
      name: 'British Curriculum',
      description: 'Traditional British education system providing comprehensive academic foundation and character development.',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Traditional academic rigor',
        'Character development',
        'Comprehensive subject coverage',
        'University preparation',
        'Cultural heritage focus',
        'Excellence standards'
      ],
      levels: ['Primary', 'Secondary', 'A-Levels'],
      duration: '13 years',
      recognition: 'UK Qualifications',
      teachers: 10,
      students: 60,
      rating: 4.7
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-6">
            Our Premium
            <span className="text-gradient-gold"> Curriculum Options</span>
          </h2>
          <p className="text-luxury max-w-3xl mx-auto">
            Each curriculum is carefully selected and delivered by certified teachers who are experts 
            in their respective fields. Choose the path that best suits your child's learning style and future goals.
          </p>
        </div>

        <div className="space-y-12 md:space-y-16">
          {curricula.map((curriculum, index) => (
            <motion.div
              key={curriculum.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card-luxury p-6 md:p-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Curriculum Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${curriculum.color} group-hover:scale-110 transition-transform duration-300`}>
                      <curriculum.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-sm mb-2">{curriculum.name}</h3>
                      <p className="text-luxury mb-4">{curriculum.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-charcoal-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{curriculum.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{curriculum.teachers} teachers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-gold-500 fill-current" />
                          <span>{curriculum.rating}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold text-navy-900 text-lg mb-4">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {curriculum.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-gold-500 flex-shrink-0" />
                          <span className="text-charcoal-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Levels and Recognition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-navy-900 mb-2">Available Levels</h4>
                      <div className="flex flex-wrap gap-2">
                        {curriculum.levels.map((level, levelIndex) => (
                          <span key={levelIndex} className="px-3 py-1 bg-sage-100 text-sage-800 text-sm font-medium rounded-full">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-900 mb-2">Recognition</h4>
                      <p className="text-charcoal-600 text-sm">{curriculum.recognition}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats and CTA */}
                <div className="space-y-6">
                  <div className="card bg-gradient-to-br from-sage-50 to-sage-100">
                    <div className="text-center space-y-4">
                      <h4 className="font-semibold text-navy-900">Current Enrollment</h4>
                      <div className="text-3xl font-bold text-gradient-gold">{curriculum.students}</div>
                      <p className="text-sm text-charcoal-600">Active Students</p>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                      Learn More
                    </button>
                    <button className="w-full border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
                      Find Teachers
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-charcoal-600 mb-2">Need help choosing?</p>
                    <button className="text-sm font-medium text-gold-600 hover:text-gold-700">
                      Schedule Consultation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}