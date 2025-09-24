'use client'

import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, Users, Mail, Phone, ArrowRight, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

const steps = [
  {
    step: 1,
    title: 'Submit Application',
    description: 'Complete our comprehensive application form with your qualifications and experience',
    icon: FileText,
    color: 'blue',
    duration: '5-10 minutes',
    details: ['Personal information', 'Education background', 'Teaching experience', 'Availability preferences']
  },
  {
    step: 2,
    title: 'Document Verification',
    description: 'We verify your TSC registration, certificates, and conduct background checks',
    icon: CheckCircle,
    color: 'green',
    duration: '24-48 hours',
    details: ['TSC number verification', 'Certificate validation', 'Background check', 'Reference checks']
  },
  {
    step: 3,
    title: 'Interview Process',
    description: 'Short video interview to assess your teaching style and compatibility',
    icon: Users,
    color: 'purple',
    duration: '30 minutes',
    details: ['Teaching philosophy discussion', 'Subject knowledge assessment', 'Communication skills evaluation', 'Platform orientation']
  },
  {
    step: 4,
    title: 'Approval & Onboarding',
    description: 'Welcome to the team! Get access to resources and start teaching',
    icon: Mail,
    color: 'orange',
    duration: 'Immediate',
    details: ['Account activation', 'Profile setup', 'Resource access', 'First student matching']
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
}

const timeline = [
  {
    time: 'Day 1',
    title: 'Application Submitted',
    description: 'Your application is received and under review'
  },
  {
    time: 'Day 2-3',
    title: 'Document Verification',
    description: 'We verify your credentials and conduct background checks'
  },
  {
    time: 'Day 4-5',
    title: 'Interview Scheduled',
    description: 'We contact you to schedule a video interview'
  },
  {
    time: 'Day 6-7',
    title: 'Approval & Onboarding',
    description: 'Welcome to the team! Start teaching within a week'
  }
]

export default function ApplicationProcess() {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

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
    <section className="section-padding bg-white" aria-labelledby="application-process-heading">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 id="application-process-heading" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Application Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined application process ensures we maintain high standards 
            while making it easy for qualified teachers to join our platform.
          </p>
        </motion.div>

        {/* Process Steps - Desktop */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16" role="list" aria-label="Application process steps">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={reducedMotion ? {} : { duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
              role="listitem"
              aria-label={`Step ${step.step}: ${step.title}`}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-300 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              )}

              <div className="card text-center hover:shadow-xl transition-all duration-300 relative z-10 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2" tabIndex={0}>
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" aria-hidden="true">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-full ${colorClasses[step.color as keyof typeof colorClasses]} mb-4 mt-4`} aria-hidden="true">
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {step.description}
                </p>

                {/* Duration */}
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>Duration: {step.duration}</span>
                </div>

                {/* Details */}
                <ul className="text-left space-y-1" role="list" aria-label={`Details for ${step.title}`}>
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" aria-hidden="true"></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Steps - Mobile Accordion */}
        <div className="md:hidden space-y-4 mb-16" role="list" aria-label="Application process steps">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={reducedMotion ? {} : { duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
              role="listitem"
              tabIndex={0}
              aria-label={`Step ${step.step}: ${step.title}`}
            >
              <div className="flex items-center space-x-4">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" aria-hidden="true">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`inline-flex p-2 rounded-lg ${colorClasses[step.color as keyof typeof colorClasses]}`} aria-hidden="true">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {step.description}
                  </p>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>Duration: {step.duration}</span>
                  </div>
                  
                  {/* Details */}
                  <ul className="space-y-1" role="list" aria-label={`Details for ${step.title}`}>
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" aria-hidden="true"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Typical Timeline
          </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From application to approval, here's what you can expect
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 transform -translate-x-1/2"></div>
              
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                      </div>
                    </div>
                    
                    {/* Content Card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className={`flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'} mb-3`}>
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-full">
                          {item.time}
                        </span>
                      </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex items-start space-x-4">
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="flex-1 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full">
                        {item.time}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-blue-200"></div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Timeline Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Total Processing Time
              </h4>
              <p className="text-gray-600 mb-4">
                Most applications are processed within 5-7 business days
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Fast Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Regular Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Support Available</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 md:p-12"
        >
          <div className="text-center mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">24/7 Support Available</span>
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need Help with Your Application?
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              Our dedicated support team is here to guide you through every step of the application process. 
              Don't hesitate to reach out if you have any questions or need assistance.
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
            {/* Phone Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
            <div className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Call Us</h4>
                  <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
                    Speak directly with our support team for immediate assistance
                  </p>
                  <a 
                    href="tel:+254700000000"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                    aria-label="Call us at +254 700 000 000"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>+254 700 000 000</span>
                  </a>
              </div>
            </div>
            </motion.div>

            {/* Email Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
            <div className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Email Us</h4>
                  <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
                    Send us your questions anytime and we'll respond within 24 hours
                  </p>
                  <a 
                    href="mailto:teachers@nelimaclearning.co.ke"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 break-all focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                    aria-label="Email us at teachers@nelimaclearning.co.ke"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span className="text-xs md:text-sm">teachers@nelimaclearning.co.ke</span>
                  </a>
              </div>
            </div>
            </motion.div>
          </div>

          {/* Additional Support Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Other Ways to Get Help
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .994-.24 1.929-.655 2.75l-1.524-1.525a3.997 3.997 0 00.526-2.225A3.997 3.997 0 0012 6a3.997 3.997 0 00-2.225.526L8.25 5.001A7.997 7.997 0 0116 10zM6 10a3.997 3.997 0 00.526 2.225L5.001 13.75A7.997 7.997 0 014 10a7.997 7.997 0 011.001-3.75l1.525 1.525A3.997 3.997 0 006 10z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">FAQ</h5>
                <p className="text-gray-600 text-xs md:text-sm">Common questions answered</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">Live Chat</h5>
                <p className="text-gray-600 text-xs md:text-sm">Instant messaging support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">Help Center</h5>
                <p className="text-gray-600 text-xs md:text-sm">Comprehensive guides</p>
              </div>
          </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button 
              onClick={scrollToApplication}
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 md:py-5 md:px-12 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Start your teacher application now"
            >
              <span className="flex items-center space-x-2">
                <span>Start Your Application Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

