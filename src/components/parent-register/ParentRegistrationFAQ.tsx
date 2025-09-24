'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Shield, 
  Clock, 
  DollarSign, 
  Users, 
  BookOpen,
  MessageCircle,
  CheckCircle,
  Star,
  Award,
  Heart
} from 'lucide-react'

export default function ParentRegistrationFAQ() {
  const [openSections, setOpenSections] = useState<number[]>([])

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqSections = [
    {
      title: "Registration & Account",
      icon: HelpCircle,
      color: "text-blue-600",
      questions: [
        {
          question: "Is registration really free?",
          answer: "Yes, absolutely! Registration is completely free with no hidden fees. You only pay for the teaching services you choose, and you pay teachers directly."
        },
        {
          question: "How long does registration take?",
          answer: "The registration process takes about 5-10 minutes to complete. Once submitted, your account will be activated within 24 hours."
        },
        {
          question: "What information do I need to provide?",
          answer: "We need basic personal information, your location, details about your children, and your education preferences. All information is kept secure and confidential."
        },
        {
          question: "Can I register multiple children?",
          answer: "Yes! You can add multiple children during registration or add more later through your parent dashboard."
        }
      ]
    },
    {
      title: "Teacher Matching",
      icon: Users,
      color: "text-green-600",
      questions: [
        {
          question: "How does teacher matching work?",
          answer: "Our smart matching system considers your location, preferred subjects, curricula, teaching mode, and your children's specific needs to find the perfect teacher matches."
        },
        {
          question: "How quickly will I get teacher matches?",
          answer: "You'll receive your first teacher matches within 24 hours of registration. We prioritize quick responses to get your children learning as soon as possible."
        },
        {
          question: "Can I choose my own teacher?",
          answer: "Yes! You can browse our teacher directory and request specific teachers, or let our system suggest matches based on your preferences."
        },
        {
          question: "What if I'm not satisfied with a teacher?",
          answer: "We offer a satisfaction guarantee. If you're not happy with a teacher, we'll help you find a replacement at no extra cost."
        }
      ]
    },
    {
      title: "Teaching Options",
      icon: BookOpen,
      color: "text-purple-600",
      questions: [
        {
          question: "What curricula do you support?",
          answer: "We support CBC (Competency Based Curriculum), IGCSE, British Curriculum, and other major educational systems used in Kenya."
        },
        {
          question: "Can I choose between in-home and online teaching?",
          answer: "Absolutely! You can choose in-home teaching, online sessions, or a hybrid approach that combines both methods."
        },
        {
          question: "What subjects are available?",
          answer: "We cover all subjects including Mathematics, English, Sciences, Languages (Kiswahili, French, German), Computer Studies, Arts, Music, and more."
        },
        {
          question: "Do you provide materials and resources?",
          answer: "Yes! Teachers provide appropriate learning materials, and you'll have access to our resource library with worksheets, practice tests, and educational guides."
        }
      ]
    },
    {
      title: "Pricing & Payment",
      icon: DollarSign,
      color: "text-orange-600",
      questions: [
        {
          question: "How much do teachers charge?",
          answer: "Teacher rates vary based on experience, qualifications, subject matter, and your specific needs. We discuss pricing during our consultation to ensure you get the best value for your investment in your child's education."
        },
        {
          question: "How do I pay for lessons?",
          answer: "You pay teachers directly. Most teachers accept bank transfers, mobile money, or cash. Payment terms are agreed upon between you and the teacher."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees whatsoever. Our matching service is free, and you only pay the teacher's agreed rate. We believe in transparent, honest pricing with no surprises."
        },
        {
          question: "Can I negotiate rates with teachers?",
          answer: "Absolutely! We encourage open discussions about rates during our consultation. Factors like lesson frequency, duration, package deals, and your specific needs can all be considered to find a rate that works for both you and the teacher."
        }
      ]
    },
    {
      title: "Safety & Security",
      icon: Shield,
      color: "text-red-600",
      questions: [
        {
          question: "Are all teachers background checked?",
          answer: "Yes! All our teachers undergo thorough background checks, TSC verification, and reference checks before being approved to teach."
        },
        {
          question: "How do you ensure child safety?",
          answer: "We have strict safety protocols including background checks, reference verification, and ongoing monitoring. Parents are always informed and involved in the process."
        },
        {
          question: "What if I have concerns about a teacher?",
          answer: "We have a dedicated support team available 24/7. You can report any concerns immediately, and we'll investigate and take appropriate action."
        },
        {
          question: "Is my personal information secure?",
          answer: "Absolutely. We use industry-standard encryption and security measures to protect your data. We never share your information without your consent."
        }
      ]
    },
    {
      title: "Support & Communication",
      icon: MessageCircle,
      color: "text-teal-600",
      questions: [
        {
          question: "What support do you provide to parents?",
          answer: "We provide comprehensive support including regular progress reports, parent-teacher communication tools, educational resources, and 24/7 customer support."
        },
        {
          question: "How can I track my child's progress?",
          answer: "You'll receive regular progress reports, have access to a parent dashboard, and can communicate directly with teachers about your child's development."
        },
        {
          question: "Do you offer parent workshops or resources?",
          answer: "Yes! We regularly organize workshops, webinars, and provide educational resources to help parents support their children's learning journey."
        },
        {
          question: "How do I contact support?",
          answer: "You can reach our support team via email, phone, WhatsApp, or through the parent dashboard. We typically respond within 2 hours during business hours."
        }
      ]
    }
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Got questions? We've got answers! Here are the most common questions parents ask about our platform.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-6">
            {faqSections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`${section.color} bg-gray-50 p-3 rounded-lg`}>
                        <section.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    {openSections.includes(sectionIndex) ? (
                      <ChevronUp className="h-6 w-6 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {openSections.includes(sectionIndex) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6 space-y-4">
                        {section.questions.map((faq, faqIndex) => (
                          <div key={faqIndex} className="border-l-4 border-blue-200 pl-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still Have Questions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Still Have Questions?</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Our support team is here to help! Get in touch with us and we'll answer any questions you have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="btn-primary inline-flex items-center"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </a>
                <button
                  onClick={() => {
                    document.getElementById('parent-registration-form')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    })
                  }}
                  className="btn-outline inline-flex items-center"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Start Registration
                </button>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="text-center bg-white rounded-xl p-6 shadow-lg">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">100% Secure</h4>
              <p className="text-sm text-gray-600">Your data is protected with industry-standard security</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Our team is always here to help you</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Satisfaction Guarantee</h4>
              <p className="text-sm text-gray-600">We're committed to your child's success</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
