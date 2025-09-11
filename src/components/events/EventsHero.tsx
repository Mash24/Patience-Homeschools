'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Star } from 'lucide-react'

export default function EventsHero() {
  return (
    <section className="bg-luxury-gradient py-24 relative overflow-hidden">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gold-400 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-navy-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gold-200">
              <Calendar className="h-5 w-5 text-gold-600" />
              <span className="text-sm font-semibold text-navy-800">Exclusive Community Events</span>
            </div>

            <h1 className="heading-lg">
              Premium Learning
              <span className="text-gradient-gold block">Experiences & Events</span>
            </h1>
            
            <p className="text-luxury max-w-3xl mx-auto">
              Join our exclusive community events designed to enrich your homeschooling journey. 
              From state-of-the-art lab sessions to cultural experiences and networking opportunities, 
              discover the premium events that set our community apart.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
              <div className="text-center group">
                <div className="text-3xl font-bold text-gradient-gold group-hover:scale-110 transition-transform duration-300">25+</div>
                <div className="text-sm text-charcoal-600 font-medium">Monthly Events</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-gradient-navy group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-sm text-charcoal-600 font-medium">Active Participants</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-gradient-gold group-hover:scale-110 transition-transform duration-300">15+</div>
                <div className="text-sm text-charcoal-600 font-medium">Premium Venues</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-gradient-navy group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-sm text-charcoal-600 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}