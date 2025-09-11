'use client'

import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, Users, Mail, Phone } from 'lucide-react'

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
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Application Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined application process ensures we maintain high standards 
            while making it easy for qualified teachers to join our platform.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-300 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              )}

              <div className="card text-center hover:shadow-xl transition-all duration-300 relative z-10">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-full ${colorClasses[step.color as keyof typeof colorClasses]} mb-4 mt-4`}>
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
                  <Clock className="h-4 w-4" />
                  <span>{step.duration}</span>
                </div>

                {/* Details */}
                <ul className="text-left space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Typical Timeline
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start space-x-6">
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help with Your Application?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you through every step of the application process. 
              Don't hesitate to reach out if you have any questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Speak directly with our support team
                </p>
                <p className="text-blue-600 font-medium">+254 XXX XXX XXX</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Send us your questions anytime
                </p>
                <p className="text-green-600 font-medium">teachers@patiencehomeschools.co.ke</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="btn-primary">
              Start Your Application Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

