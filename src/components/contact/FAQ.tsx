'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'How does the teacher matching process work?',
    answer: 'Parents submit their requirements through our form, and our system matches them with 3 qualified teachers based on curriculum expertise, subject specialization, location, and availability. Patience reviews and approves the final matches.'
  },
  {
    question: 'What qualifications do your teachers have?',
    answer: 'All our teachers are TSC-certified with valid teaching certificates. They have minimum 2 years of experience and are background-checked. Many hold advanced degrees in their subject areas.'
  },
  {
    question: 'Which curricula do you support?',
    answer: 'We support CBC (Competency Based Curriculum), IGCSE, and British Curriculum. Our teachers are specialized in these curricula and can provide comprehensive support for each.'
  },
  {
    question: 'How much does it cost to hire a teacher?',
    answer: 'Teacher rates vary based on qualifications and experience, typically ranging from KSh 1,500 to KSh 3,000 per hour. We don\'t charge any platform fees - you pay teachers directly.'
  },
  {
    question: 'Do you offer online or in-person teaching?',
    answer: 'We offer both online and in-person teaching options. Many teachers are available for both formats, and you can specify your preference when submitting your requirements.'
  },
  {
    question: 'How quickly can I get matched with a teacher?',
    answer: 'We typically provide teacher recommendations within 24 hours of receiving your request. The entire process from application to starting lessons usually takes 3-5 days.'
  },
  {
    question: 'What if I\'m not satisfied with my teacher?',
    answer: 'We offer a satisfaction guarantee. If you\'re not happy with your teacher match, we\'ll help you find a replacement at no additional cost within the first month.'
  },
  {
    question: 'Do you provide learning resources?',
    answer: 'Yes! We offer a comprehensive library of free learning resources including study guides, worksheets, and curriculum-specific materials for all supported curricula.'
  },
  {
    question: 'How do I apply to become a teacher?',
    answer: 'Visit our "Apply as Teacher" page and complete the application form. We\'ll review your qualifications, conduct an interview, and get back to you within 48 hours.'
  },
  {
    question: 'What events do you organize?',
    answer: 'We organize regular community events including lab sessions at partner schools, sports days, student meetups, and educational workshops for both students and parents.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our services, teacher matching process, 
            and how we can help your family.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-white"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Don't hesitate to reach out to us directly. 
              We're here to help with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Contact Us Now
              </button>
              <button className="btn-outline">
                Call +254 XXX XXX XXX
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

