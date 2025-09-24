'use client'

import { motion } from 'framer-motion'
import { DollarSign, Users, Clock, Shield, Award, Heart, CheckCircle } from 'lucide-react'
import TestimonialCarousel from '@/components/ux/TestimonialCarousel'

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 h-full">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl ${colorClasses[benefit.color as keyof typeof colorClasses]} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <benefit.icon className="h-8 w-8" />
              </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                {benefit.title}
              </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {benefit.description}
              </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start"
        >
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-6 py-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Requirements to Join</h3>
              </div>
              <p className="text-gray-600">Ensure you meet these essential criteria</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/20">
            <ul className="space-y-4">
              {requirements.map((requirement, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                    <span className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">{requirement}</span>
                  </motion.li>
              ))}
            </ul>
          </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Application Ready</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Get Started?
            </h4>
                  <p className="text-gray-600 leading-relaxed">
              Complete the application form and join our community of dedicated educators. 
              We'll review your application and get back to you within 48 hours.
            </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Free to join - no registration fees</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⚡</span>
                    </div>
                    <span className="text-gray-700 font-medium">Quick approval process</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🎯</span>
                    </div>
                    <span className="text-gray-700 font-medium">Ongoing support and training</span>
                  </div>
              </div>

                <div className="mt-6 text-center">
                  <button 
                    onClick={() => {
                      const applicationSection = document.getElementById('application')
                      if (applicationSection) {
                        applicationSection.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }
                    }}
                    className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Start Application</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Teacher Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              What Our Teachers Say
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from educators who have found success and fulfillment in our network
            </p>
            </div>

          <TestimonialCarousel
            testimonials={[
              {
                id: '1',
                name: 'Grace Wanjiku',
                role: 'Mathematics Teacher, 3 years',
                content: 'Working with Nelimac Learning has given me the flexibility to teach while maintaining my work-life balance. The families are wonderful to work with and the support team is always there when I need help.',
                rating: 5
              },
              {
                id: '2',
                name: 'David Kimani',
                role: 'English Teacher, 2 years',
                content: 'The platform is well-organized and the support team is always helpful. I\'ve built lasting relationships with the families I teach and the payment system is reliable.',
                rating: 5
              },
              {
                id: '3',
                name: 'Sarah Mwangi',
                role: 'CBC Teacher, 4 years',
                content: 'I love the variety of students I get to work with. Each family has unique needs and it keeps my teaching fresh and engaging. The training resources are excellent.',
                rating: 5
              },
              {
                id: '4',
                name: 'John Otieno',
                role: 'Science Teacher, 5 years',
                content: 'The professional development opportunities here are unmatched. I\'ve grown as an educator and the competitive rates make it worthwhile.',
                rating: 5
              },
              {
                id: '5',
                name: 'Mary Njeri',
                role: 'French Teacher, 2 years',
                content: 'The application process was smooth and the onboarding was comprehensive. I felt supported from day one and continue to receive excellent guidance.',
                rating: 5
              }
            ]}
            autoSlide={true}
            slideInterval={4000}
            className="max-w-4xl mx-auto"
          />
        </motion.div>

      </div>
    </section>
  )
}

