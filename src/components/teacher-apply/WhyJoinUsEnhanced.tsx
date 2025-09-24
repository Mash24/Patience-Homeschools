'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, Users, Clock, Shield, Award, Heart, CheckCircle, Star, TrendingUp, Globe, BookOpen, Zap, GraduationCap } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function WhyJoinUsEnhanced() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeTab, setActiveTab] = useState('benefits')

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
      title: 'Competitive Earnings',
      description: 'Earn KSh 1,500 - 3,000 per hour based on your qualifications and experience',
      color: 'green',
      highlight: 'Top earners make KSh 50,000+ monthly'
    },
    {
      icon: Users,
      title: 'Flexible Schedule',
      description: 'Choose your own hours and work with families that fit your availability',
      color: 'blue',
      highlight: 'Work from anywhere'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'All payments are processed securely through our platform with guaranteed payments',
      color: 'purple',
      highlight: '100% payment protection'
    },
    {
      icon: Clock,
      title: 'Work-Life Balance',
      description: 'Set your own schedule and maintain a healthy work-life balance',
      color: 'orange',
      highlight: 'Perfect for parents'
    },
    {
      icon: Award,
      title: 'Professional Growth',
      description: 'Access to training resources and opportunities for professional development',
      color: 'indigo',
      highlight: 'Free training programs'
    },
    {
      icon: Heart,
      title: 'Make a Difference',
      description: 'Help shape young minds and make a meaningful impact in children\'s education',
      color: 'pink',
      highlight: 'Change lives daily'
    }
  ]

  const requirements = [
    {
      requirement: 'TSC registration number',
      description: 'Must be registered with Teachers Service Commission',
      mandatory: true,
      icon: Shield
    },
    {
      requirement: 'Bachelor\'s degree or higher in education or related field',
      description: 'Minimum educational qualification required',
      mandatory: true,
      icon: GraduationCap
    },
    {
      requirement: 'Minimum 2 years teaching experience',
      description: 'Proven track record in teaching',
      mandatory: true,
      icon: BookOpen
    },
    {
      requirement: 'Certificate of Good Conduct',
      description: 'Clean criminal record required',
      mandatory: true,
      icon: Award
    },
    {
      requirement: 'Passion for teaching and working with children',
      description: 'Genuine love for education and child development',
      mandatory: true,
      icon: Heart
    },
    {
      requirement: 'Reliable internet connection (for online teaching)',
      description: 'Stable internet for virtual classes',
      mandatory: false,
      icon: Globe
    }
  ]

  const successStories = [
    {
      name: 'Grace M.',
      subject: 'Mathematics',
      experience: '3 years',
      earnings: 'KSh 45,000/month',
      quote: 'I love the flexibility. I can teach in the morning and spend time with my family in the evening.',
      avatar: 'GM'
    },
    {
      name: 'David K.',
      subject: 'Science',
      experience: '5 years',
      earnings: 'KSh 52,000/month',
      quote: 'The platform connects me with families who truly value education. It\'s rewarding work.',
      avatar: 'DK'
    },
    {
      name: 'Jane W.',
      subject: 'English',
      experience: '4 years',
      earnings: 'KSh 38,000/month',
      quote: 'Working here has given me the perfect work-life balance I was looking for.',
      avatar: 'JW'
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
    <section className="section-padding bg-gray-50" aria-labelledby="why-join-heading">
      <div className="container-custom">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={reducedMotion ? {} : { duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 id="why-join-heading" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Join Our Team?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Nairobi's most trusted homeschooling platform and become part of a community 
            that values quality education and meaningful connections.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'benefits'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Benefits
            </button>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'requirements'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Requirements
            </button>
            <button
              onClick={() => setActiveTab('success')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'success'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Success Stories
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'benefits' && (
            <motion.div
              key="benefits"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -20 }}
              transition={reducedMotion ? {} : { duration: 0.3 }}
              className="space-y-8"
            >
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
                    animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={reducedMotion ? {} : { duration: 0.8, delay: index * 0.1 }}
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

              {/* Earnings Calculator */}
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={reducedMotion ? {} : { duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Calculate Your Potential Earnings
                  </h3>
                  <p className="text-lg opacity-90">
                    See how much you could earn teaching with us
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-2">Part-time (20 hrs/week)</h4>
                    <p className="text-2xl font-bold">KSh 30,000 - 60,000</p>
                    <p className="text-sm opacity-80">per month</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-2">Full-time (40 hrs/week)</h4>
                    <p className="text-2xl font-bold">KSh 60,000 - 120,000</p>
                    <p className="text-sm opacity-80">per month</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-2">Premium (50+ hrs/week)</h4>
                    <p className="text-2xl font-bold">KSh 75,000 - 150,000</p>
                    <p className="text-sm opacity-80">per month</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'requirements' && (
            <motion.div
              key="requirements"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -20 }}
              transition={reducedMotion ? {} : { duration: 0.3 }}
              className="space-y-8"
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Application Requirements
                  </h3>
                  <p className="text-gray-600">
                    Here's what you need to join our teaching team
                  </p>
                </div>

                <div className="space-y-4">
                  {requirements.map((req, index) => (
                    <motion.div
                      key={req.requirement}
                      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                      animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={reducedMotion ? {} : { duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-3 rounded-xl ${
                          req.mandatory ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <req.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {req.requirement}
                            </h4>
                            {req.mandatory && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {req.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={reducedMotion ? {} : { duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-12 text-center"
                >
                  <div className="bg-blue-50 rounded-2xl p-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Ready to Apply?
                    </h4>
                    <p className="text-gray-600 mb-6">
                      If you meet these requirements, we'd love to have you on our team!
                    </p>
                    <button
                      onClick={scrollToApplication}
                      className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                      aria-label="Start your teacher application"
                    >
                      Start Application
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'success' && (
            <motion.div
              key="success"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -20 }}
              transition={reducedMotion ? {} : { duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Success Stories
                </h3>
                <p className="text-gray-600">
                  Real teachers sharing their experiences with our platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {successStories.map((story, index) => (
                  <motion.div
                    key={story.name}
                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                    animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={reducedMotion ? {} : { duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                        {story.avatar}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{story.name}</h4>
                      <p className="text-sm text-gray-600">{story.subject} Teacher</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{story.experience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Earnings:</span>
                        <span className="font-medium text-green-600">{story.earnings}</span>
                      </div>
                    </div>

                    <blockquote className="text-gray-600 text-sm italic leading-relaxed">
                      "{story.quote}"
                    </blockquote>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={reducedMotion ? {} : { duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Join Our Success Stories
                  </h3>
                  <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                    Become part of our growing community of successful teachers making a difference in children's lives.
                  </p>
                  <button
                    onClick={scrollToApplication}
                    className="bg-white text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2"
                    aria-label="Start your teacher application now"
                  >
                    Start Your Journey Today
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
