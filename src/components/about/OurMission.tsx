'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Heart, Users, BookOpen, Award } from 'lucide-react'

const missionPoints = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide accessible, high-quality education by connecting qualified teachers with families seeking personalized learning solutions in Nairobi.',
    color: 'blue'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To become Nairobi\'s leading platform for homeschooling, creating a supportive community where every child can thrive academically and personally.',
    color: 'green'
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'We believe in the power of personalized education, community support, and the importance of nurturing each child\'s unique potential.',
    color: 'purple'
  }
]

const principles = [
  {
    icon: Users,
    title: 'Community First',
    description: 'We foster a supportive community where families and teachers can connect, share experiences, and grow together.'
  },
  {
    icon: BookOpen,
    title: 'Quality Education',
    description: 'We maintain high standards by working only with TSC-certified teachers and providing comprehensive learning resources.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from teacher matching to resource development and community support.'
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600'
}

export default function OurMission() {
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
            Our Mission & Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're driven by a commitment to educational excellence and community building, 
            ensuring every child has access to quality education tailored to their needs.
          </p>
        </motion.div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {missionPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card text-center hover:shadow-xl transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-full ${colorClasses[point.color as keyof typeof colorClasses]} mb-6`}>
                <point.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {point.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Principles */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our Core Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <div key={principle.title} className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <principle.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">{principle.title}</h4>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Making a Difference
              </h3>
              <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                Since our founding, we've helped hundreds of families find the perfect 
                educational match, supported dozens of qualified teachers in building 
                successful careers, and created a thriving community of learners and educators.
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">200+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Families</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Qualified Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">98%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">3+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Years of Service</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

