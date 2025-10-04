'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Search, 
  Users, 
  CheckCircle, 
  Star, 
  Clock, 
  Shield, 
  ArrowRight,
  Zap,
  Heart,
  Award,
  Globe,
  BookOpen,
  GraduationCap,
  Target,
  MessageCircle,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function HowItWorksEnhanced() {
  const [activeStep, setActiveStep] = useState(0)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())

  const steps = [
    {
      step: 1,
      title: 'Submit Your Requirements',
      description: 'Fill out our detailed form with your child\'s needs, curriculum, subjects, and preferences.',
      icon: Search,
      color: 'blue',
      duration: '2 minutes',
      ctaText: 'Start Form',
      details: [
        'Child\'s age and grade level',
        'Preferred curriculum (CBC/IGCSE/British)',
        'Required subjects',
        'Schedule preferences',
        'Location and budget'
      ],
      features: [
        { icon: Clock, text: 'Quick 2-minute form' },
        { icon: Shield, text: 'Secure data handling' },
        { icon: Zap, text: 'Auto-save progress' }
      ]
    },
    {
      step: 2,
      title: 'Teacher Verification & Matching',
      description: 'Our admin team carefully reviews your request and matches you with suitable, pre-verified teachers.',
      icon: Users,
      color: 'green',
      duration: 'Within 24 hours',
      ctaText: 'Continue',
      details: [
        'Manual review by education team',
        'Verified teacher pool',
        'Safe & secure process',
        'Personalized matching',
        'Quality assurance'
      ],
      features: [
        { icon: Shield, text: 'Manual review by education team' },
        { icon: Award, text: 'Verified teacher pool' },
        { icon: Target, text: 'Safe & secure process' }
      ]
    },
    {
      step: 3,
      title: 'Review Teacher Profiles',
      description: 'See detailed teacher profiles, qualifications, and experience. Compare availability and rates before choosing.',
      icon: CheckCircle,
      color: 'purple',
      duration: '1 day',
      ctaText: 'Review Profiles',
      details: [
        'Verified teacher details',
        'Parent reviews/testimonials',
        'Schedule & subject fit',
        'Teaching qualifications',
        'Sample lesson plans'
      ],
      features: [
        { icon: Star, text: 'Verified teacher details' },
        { icon: Heart, text: 'Parent testimonials' },
        { icon: BookOpen, text: 'Schedule & subject fit' }
      ]
    },
    {
      step: 4,
      title: 'Choose & Start Learning',
      description: 'Select your teacher and start lessons right away. We\'ll support you throughout the journey.',
      icon: Star,
      color: 'orange',
      duration: 'Immediate (based on availability)',
      ctaText: 'Get Started',
      details: [
        'Flexible scheduling',
        'Transparent pricing',
        'Ongoing admin support',
        'Set learning goals',
        'Track progress'
      ],
      features: [
        { icon: Calendar, text: 'Flexible scheduling' },
        { icon: MessageCircle, text: 'Transparent pricing' },
        { icon: DollarSign, text: 'Ongoing admin support' }
      ]
    }
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-600'
    }
  }

  const guarantees = [
    {
      icon: Shield,
      title: 'TSC Certified Teachers',
      description: 'All teachers are verified TSC members with valid teaching certificates',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: '24-Hour Response',
      description: 'Get teacher recommendations within 24 hours of submitting your request',
      color: 'text-blue-600'
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee - we\'ll find a replacement if you\'re not happy',
      color: 'text-purple-600'
    },
    {
      icon: Heart,
      title: 'Personalized Matching',
      description: 'Our admin team considers your child\'s unique learning style and preferences',
      color: 'text-pink-600'
    }
  ]

  const stats = [
    { number: '98%', label: 'Success Rate', color: 'text-green-600' },
    { number: '24hrs', label: 'Average Response', color: 'text-blue-600' },
    { number: '200+', label: 'Happy Families', color: 'text-purple-600' },
    { number: '50+', label: 'Expert Teachers', color: 'text-orange-600' }
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8">
            Our admin-driven process ensures personalized teacher matching for every family
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-orange-200 z-0" />
          
          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Card */}
                <div 
                  className={`card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col ${
                    activeStep === index ? 'ring-2 ring-blue-500 shadow-xl' : ''
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`bg-gradient-to-r ${colorClasses[step.color as keyof typeof colorClasses].gradient} text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg`}>
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-3 sm:pt-4 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`inline-flex p-2 sm:p-3 rounded-full ${colorClasses[step.color as keyof typeof colorClasses].bg} mb-2 sm:mb-3`}>
                      <step.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${colorClasses[step.color as keyof typeof colorClasses].text}`} />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Duration */}
                    <div className="flex items-center text-xs text-gray-500 mb-2 sm:mb-3">
                      <Clock className="h-3 w-3 mr-1" />
                      Duration: {step.duration}
                    </div>

                    {/* Features - Show only first 2 */}
                    <div className="space-y-1 mb-2 sm:mb-3">
                      {step.features.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-gray-600">
                          <feature.icon className="h-3 w-3 mr-2 text-blue-600" />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Show More Arrow - Always visible for cards with more content */}
                    {step.features.length > 2 && (
                      <div className="mb-2 sm:mb-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            const newExpanded = new Set(expandedCards)
                            if (expandedCards.has(step.step)) {
                              newExpanded.delete(step.step)
                            } else {
                              newExpanded.add(step.step)
                            }
                            setExpandedCards(newExpanded)
                          }}
                          className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {expandedCards.has(step.step) ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Show More
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Expanded Content */}
                    {expandedCards.has(step.step) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 pt-3 mb-3"
                      >
                        {/* Additional Features */}
                        {step.features.length > 2 && (
                          <div className="space-y-1 mb-3">
                            {step.features.slice(2).map((feature, featureIndex) => (
                              <div key={featureIndex + 2} className="flex items-center text-xs text-gray-600">
                                <feature.icon className="h-3 w-3 mr-2 text-blue-600" />
                                <span>{feature.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Details */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-xs">What's Included:</h4>
                          <ul className="space-y-1">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center text-xs text-gray-600">
                                <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Button */}
                    <div className="mt-auto pt-2 sm:pt-3">
                      <button className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-xs font-medium transition-all ${
                        activeStep === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {activeStep === index ? 'Active Step' : step.ctaText}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 lg:mt-20"
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-8 sm:mb-10 lg:mb-12">
            Our Guarantees to You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`bg-gray-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                  <guarantee.icon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${guarantee.color}`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{guarantee.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{guarantee.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-blue-100">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Find Your Perfect Teacher?
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              Join hundreds of families who have found their ideal education solution through our platform. 
              Start your journey today!
            </p>
            <div className="flex flex-row gap-2 sm:gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('teacher-matching-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary inline-flex items-center justify-center group text-xs py-2 px-2 sm:py-3 sm:px-4 sm:text-sm whitespace-nowrap"
              >
                <span className="hidden sm:inline">Start Your Search Now</span>
                <span className="sm:hidden">Start Search</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/254742909506?text=Hi%20Nelimac%20Team,%20I%20would%20like%20to%20speak%20to%20your%20team%20about%20finding%20a%20teacher%20for%20my%20child."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center justify-center hover:bg-green-50 transition-colors text-xs py-2 px-2 sm:py-3 sm:px-4 sm:text-sm whitespace-nowrap"
              >
                <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Speak to Our Team</span>
                <span className="sm:hidden">Speak to Team</span>
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600" />
                <span>24hr Response</span>
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-600" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
