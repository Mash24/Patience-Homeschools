'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, DollarSign, Shield, Clock, Award, ArrowRight, CheckCircle, Star, TrendingUp, Globe, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function TeacherApplyHeroEnhanced() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Rates',
      description: 'KSh 1,500 - 3,000 per hour',
      color: 'green',
      highlight: 'Top 10% earners'
    },
    {
      icon: Users,
      title: 'Flexible Schedule',
      description: 'Choose your own hours',
      color: 'blue',
      highlight: 'Work-life balance'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Guaranteed payments',
      color: 'purple',
      highlight: '100% secure'
    }
  ]

  const stats = [
    { value: '50+', label: 'Active Teachers', color: 'green', trend: '+15%' },
    { value: '200+', label: 'Happy Families', color: 'blue', trend: '+25%' },
    { value: 'KSh 2,500', label: 'Avg. Hourly Rate', color: 'orange', trend: '+12%' },
    { value: '98%', label: 'Satisfaction Rate', color: 'purple', trend: '+2%' }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Mathematics Teacher',
      rating: 5,
      text: 'The flexibility and support here is unmatched. I can teach from home while earning competitive rates.',
      avatar: 'SM'
    },
    {
      name: 'John K.',
      role: 'Science Teacher',
      rating: 5,
      text: 'Great platform for connecting with families who value quality education. Highly recommended!',
      avatar: 'JK'
    },
    {
      name: 'Mary W.',
      role: 'English Teacher',
      rating: 5,
      text: 'The application process was smooth and the team is very supportive. Love teaching here!',
      avatar: 'MW'
    }
  ]

  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  }

  const scrollToApplication = () => {
    const applicationSection = document.getElementById('application')
    if (applicationSection) {
      applicationSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 overflow-hidden" aria-labelledby="hero-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container-custom py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={reducedMotion ? {} : { duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
              transition={reducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm"
            >
              <GraduationCap className="h-5 w-5 text-green-600" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">Join Nairobi's Premier Teaching Network</span>
            </motion.div>

            <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Join Our Team of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 block">
                Expert Teachers
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Share your expertise with Nairobi's homeschooling community. 
              Connect with families who value quality education and make a meaningful impact on young minds.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={reducedMotion ? {} : { duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button 
                onClick={scrollToApplication}
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                aria-label="Start your teacher application"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Application</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </button>
              
              <button 
                className="group bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-2"
                aria-label="Learn more about teaching with us"
              >
                <span className="flex items-center space-x-2">
                  <span>Learn More</span>
                  <Globe className="h-5 w-5 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={reducedMotion ? {} : { duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 h-full">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex p-3 bg-gradient-to-br from-${benefit.color}-500 to-${benefit.color}-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <benefit.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {benefit.highlight}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={reducedMotion ? {} : { duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-12 mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Trusted by Teachers & Families
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join a growing community of educators making a difference in children's lives
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={reducedMotion ? {} : { duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl md:text-4xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses]} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    <span>{stat.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={reducedMotion ? {} : { duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                What Our Teachers Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from teachers who are already making a difference
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={reducedMotion ? {} : { duration: 0.6, delay: 1.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={reducedMotion ? {} : { duration: 0.6, delay: 1.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join our community of passionate educators and help shape the future of education in Nairobi.
              </p>
              <button
                onClick={scrollToApplication}
                className="group bg-white text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2"
                aria-label="Start your teacher application now"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Your Application</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
