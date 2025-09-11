'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Mwangi',
    role: 'Parent of Grade 6 Student',
    content: 'Patience Home Schools connected us with an amazing CBC teacher who understood my daughter\'s learning style. The resources and support have been invaluable.',
    rating: 5,
    location: 'Westlands, Nairobi'
  },
  {
    name: 'David Kimani',
    role: 'Parent of IGCSE Student',
    content: 'The lab sessions and community events have made homeschooling feel less isolating. My son has made friends and gained practical experience.',
    rating: 5,
    location: 'Karen, Nairobi'
  },
  {
    name: 'Grace Wanjiku',
    role: 'Parent of British Curriculum Student',
    content: 'The teacher matching process was so thorough. We found the perfect match for our son\'s needs, and the results speak for themselves.',
    rating: 5,
    location: 'Runda, Nairobi'
  },
  {
    name: 'James Otieno',
    role: 'Parent of Multiple Students',
    content: 'Having access to qualified teachers for different subjects and curricula under one platform has simplified our homeschooling journey significantly.',
    rating: 5,
    location: 'Kilimani, Nairobi'
  },
  {
    name: 'Mary Njoki',
    role: 'Parent of Grade 8 Student',
    content: 'The free resources and regular events have enriched our homeschooling experience. Highly recommend to any parent considering homeschooling.',
    rating: 5,
    location: 'Lavington, Nairobi'
  },
  {
    name: 'Peter Mwangi',
    role: 'Parent of IGCSE Student',
    content: 'The platform made it easy to find teachers who specialize in the subjects my daughter needed. The quality of education has exceeded our expectations.',
    rating: 5,
    location: 'Kileleshwa, Nairobi'
  }
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Parents Say
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from families who have transformed their homeschooling experience 
            with Patience Home Schools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 sm:-top-4 left-4 sm:left-6">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                  <Quote className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-3 sm:mb-4 pt-3 sm:pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                <div className="font-semibold text-sm sm:text-base text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {testimonial.role}
                </div>
                <div className="text-xs sm:text-sm text-blue-600">
                  {testimonial.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Parent Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
                <div className="text-gray-600">Happy Families</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Qualified Teachers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
