'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, Heart, Award } from 'lucide-react'

export default function PatienceStory() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Meet Patience
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Patience founded Patience Home Schools with a simple yet powerful vision: 
                  to make quality education accessible to every family in Nairobi, regardless 
                  of their circumstances or location.
                </p>
                <p>
                  With over 8 years of experience in education and a deep understanding of 
                  Kenya's diverse curricula, Patience recognized the need for a platform 
                  that could connect qualified teachers with families seeking personalized 
                  education solutions.
                </p>
                <p>
                  Her journey began when she noticed that many families were struggling to 
                  find qualified teachers who could adapt to their children's unique learning 
                  styles and support different curricula. This inspired her to create a 
                  comprehensive platform that addresses these challenges.
                </p>
              </div>

              {/* Achievements */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">8+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">200+</div>
                  <div className="text-sm text-gray-600">Families Helped</div>
                </div>
              </div>
            </motion.div>

            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    P
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Patience</h3>
                  <p className="text-gray-600">Founder & Education Director</p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

