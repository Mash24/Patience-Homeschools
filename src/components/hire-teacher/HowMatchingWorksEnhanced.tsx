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
  DollarSign
} from 'lucide-react'

export default function HowItWorksEnhanced() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      step: 1,
      title: 'Submit Your Requirements',
      description: 'Fill out our detailed form with your child\'s needs, curriculum, subjects, and preferences.',
      icon: Search,
      color: 'blue',
      duration: '2 minutes',
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
      title: 'AI-Powered Matching',
      description: 'Our intelligent system analyzes your requirements and matches you with 3 qualified teachers.',
      icon: Users,
      color: 'green',
      duration: '24 hours',
      details: [
        'TSC certification verification',
        'Curriculum expertise matching',
        'Subject specialization',
        'Location compatibility',
        'Schedule availability'
      ],
      features: [
        { icon: Globe, text: 'AI-powered algorithm' },
        { icon: Award, text: 'Quality verification' },
        { icon: Target, text: 'Perfect matching' }
      ]
    },
    {
      step: 3,
      title: 'Review Teacher Profiles',
      description: 'Review detailed profiles, qualifications, experience, and parent reviews.',
      icon: CheckCircle,
      color: 'purple',
      duration: '1-2 days',
      details: [
        'Teaching qualifications',
        'Years of experience',
        'Previous parent reviews',
        'Teaching philosophy',
        'Sample lesson plans'
      ],
      features: [
        { icon: Star, text: 'Detailed profiles' },
        { icon: Heart, text: 'Parent testimonials' },
        { icon: BookOpen, text: 'Sample lessons' }
      ]
    },
    {
      step: 4,
      title: 'Choose & Start Learning',
      description: 'Select your preferred teacher and begin your personalized learning journey.',
      icon: Star,
      color: 'orange',
      duration: 'Immediate',
      details: [
        'Schedule initial meeting',
        'Set learning goals',
        'Begin regular sessions',
        'Track progress',
        'Ongoing support'
      ],
      features: [
        { icon: Calendar, text: 'Flexible scheduling' },
        { icon: MessageCircle, text: 'Direct communication' },
        { icon: DollarSign, text: 'Transparent pricing' }
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
      description: 'Our AI considers your child\'s unique learning style and preferences',
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our admin-driven process ensures personalized teacher matching for every family
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-orange-200 z-0" />
          
          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
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
                  className={`card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    activeStep === index ? 'ring-2 ring-blue-500 shadow-xl' : ''
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`bg-gradient-to-r ${colorClasses[step.color as keyof typeof colorClasses].gradient} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}>
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-6">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-full ${colorClasses[step.color as keyof typeof colorClasses].bg} mb-4`}>
                      <step.icon className={`h-8 w-8 ${colorClasses[step.color as keyof typeof colorClasses].text}`} />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Duration */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration: {step.duration}
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-gray-600">
                          <feature.icon className="h-3 w-3 mr-2 text-blue-600" />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Details (shown when active) */}
                    {activeStep === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 pt-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">What's Included:</h4>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center text-xs text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Action Button */}
                    <div className="mt-4">
                      <button className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        activeStep === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {activeStep === index ? 'Active Step' : 'Learn More'}
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
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Our Guarantees to You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <guarantee.icon className={`h-8 w-8 ${guarantee.color}`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{guarantee.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{guarantee.description}</p>
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
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Teacher?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Join hundreds of families who have found their ideal education solution through our platform. 
              Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('teacher-matching-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary inline-flex items-center justify-center group"
              >
                Start Your Search Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline inline-flex items-center justify-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Speak to Our Team
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                <span>24hr Response</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-600" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
