'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Users, Calendar, Download, Shield, Award, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-luxury-gradient min-h-screen flex items-center relative overflow-hidden">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gold-400 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-navy-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-sage-400 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-200"
              >
                <Shield className="h-4 w-4 text-gold-600" />
                <span className="text-sm font-medium text-navy-800">TSC Certified Teachers</span>
              </motion.div>

              <h1 className="heading-xl">
                Nairobi's Premier
                <span className="text-gradient-gold block">Homeschool Collective</span>
              </h1>
              
              <p className="text-luxury max-w-2xl">
                Experience the gold standard in homeschooling with our curated network of 
                TSC-certified educators, comprehensive resources, and exclusive community events 
                designed for discerning families across Nairobi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/hire-teacher" className="btn-primary text-center group">
                <span className="flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Find Your Perfect Teacher</span>
                </span>
              </Link>
              <Link href="/teacher-apply" className="btn-outline text-center group">
                <span className="flex items-center justify-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Join Our Faculty</span>
                </span>
              </Link>
            </div>

            {/* Luxury Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-8 pt-4 sm:pt-6 lg:pt-8"
            >
              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient-gold group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-xs sm:text-sm text-charcoal-600 font-medium">Elite Educators</div>
              </div>
              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient-navy group-hover:scale-110 transition-transform duration-300">200+</div>
                <div className="text-xs sm:text-sm text-charcoal-600 font-medium">Prestigious Families</div>
              </div>
              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient-gold group-hover:scale-110 transition-transform duration-300">3</div>
                <div className="text-xs sm:text-sm text-charcoal-600 font-medium">Premium Curricula</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Luxury Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Teacher Matching Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-luxury group cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-br from-gold-100 to-gold-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-gold-600" />
                  </div>
                  <h3 className="font-semibold text-navy-900 text-lg">Elite Educators</h3>
                </div>
                <p className="text-charcoal-600 leading-relaxed">
                  Handpicked TSC-certified teachers with proven expertise in CBC, IGCSE, and British curricula.
                </p>
                <div className="mt-4 flex items-center text-gold-600 text-sm font-medium">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  <span>Premium Quality</span>
                </div>
              </motion.div>

              {/* Resources Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-luxury group cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-br from-navy-100 to-navy-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-navy-600" />
                  </div>
                  <h3 className="font-semibold text-navy-900 text-lg">Exclusive Resources</h3>
                </div>
                <p className="text-charcoal-600 leading-relaxed">
                  Curated study materials, premium guides, and exclusive content for all curricula.
                </p>
                <div className="mt-4 flex items-center text-navy-600 text-sm font-medium">
                  <Download className="h-4 w-4 mr-1" />
                  <span>Instant Access</span>
                </div>
              </motion.div>

              {/* Events Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-luxury group cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-br from-sage-100 to-sage-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-sage-600" />
                  </div>
                  <h3 className="font-semibold text-navy-900 text-lg">Exclusive Events</h3>
                </div>
                <p className="text-charcoal-600 leading-relaxed">
                  Premium lab sessions, cultural events, and networking opportunities across Nairobi.
                </p>
                <div className="mt-4 flex items-center text-sage-600 text-sm font-medium">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>VIP Access</span>
                </div>
              </motion.div>

              {/* Concierge Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-luxury group cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-br from-gold-100 to-gold-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-6 w-6 text-gold-600" />
                  </div>
                  <h3 className="font-semibold text-navy-900 text-lg">Concierge Service</h3>
                </div>
                <p className="text-charcoal-600 leading-relaxed">
                  Personalized matching, dedicated support, and white-glove service for your family.
                </p>
                <div className="mt-4 flex items-center text-gold-600 text-sm font-medium">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  <span>24/7 Support</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
