'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, BookOpen, Users, Globe, Award } from 'lucide-react'

export default function CurriculumFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Which curriculum is best for my child?',
      answer: 'The best curriculum depends on your child\'s learning style, future goals, and your family\'s preferences. CBC is excellent for holistic development and local university preparation, IGCSE offers international recognition and flexibility, while the British curriculum provides traditional academic rigor. Our education consultants can help you make the right choice.',
      category: 'General',
      icon: BookOpen
    },
    {
      question: 'Can my child switch between curricula?',
      answer: 'Yes, it\'s possible to switch curricula, but it requires careful planning and may involve some adjustment period. We recommend discussing your options with our education consultants to ensure a smooth transition that doesn\'t disrupt your child\'s learning progress.',
      category: 'General',
      icon: Users
    },
    {
      question: 'Are your teachers certified for all curricula?',
      answer: 'Absolutely! All our teachers are TSC-certified and have specialized training in their respective curricula. They undergo continuous professional development to stay updated with the latest teaching methods and curriculum changes.',
      category: 'Teachers',
      icon: Users
    },
    {
      question: 'What is the difference between IGCSE and British curriculum?',
      answer: 'IGCSE is an international qualification that can be completed in 2-4 years and offers flexible subject choices. The British curriculum is a complete 13-year education system from primary to A-Levels. IGCSE is more flexible and internationally recognized, while the British curriculum provides a more traditional, structured approach.',
      category: 'Curricula',
      icon: Globe
    },
    {
      question: 'How does CBC prepare students for university?',
      answer: 'CBC focuses on developing key competencies and skills that are essential for university success, including critical thinking, problem-solving, and digital literacy. It also provides a strong foundation in core subjects while emphasizing practical application and real-world relevance.',
      category: 'CBC',
      icon: BookOpen
    },
    {
      question: 'What support is available for parents?',
      answer: 'We provide comprehensive support for parents including regular progress reports, parent-teacher conferences, curriculum guidance, and access to our parent community. Our education consultants are also available to answer questions and provide guidance throughout your homeschooling journey.',
      category: 'Support',
      icon: Award
    },
    {
      question: 'How are assessments conducted?',
      answer: 'Assessment methods vary by curriculum. CBC uses competency-based assessment with continuous evaluation, IGCSE uses formal examinations, and the British curriculum combines continuous assessment with formal exams. We provide detailed assessment schedules and support to help students prepare effectively.',
      category: 'Assessment',
      icon: BookOpen
    },
    {
      question: 'Can I combine elements from different curricula?',
      answer: 'While each curriculum has its own structure, we can work with you to create a customized learning plan that incorporates the best elements from different curricula. This requires careful planning and may not be suitable for all students, so we recommend consulting with our education team first.',
      category: 'Customization',
      icon: Users
    }
  ]

  const categories = ['All', 'General', 'Teachers', 'Curricula', 'CBC', 'Support', 'Assessment', 'Customization']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-6">
            Frequently Asked
            <span className="text-gradient-gold"> Questions</span>
          </h2>
          <p className="text-luxury max-w-3xl mx-auto">
            Find answers to common questions about our curricula, teaching methods, and homeschooling support. 
            If you don't see your question here, feel free to contact us directly.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gold-500 text-navy-900'
                  : 'bg-sage-100 text-charcoal-600 hover:bg-sage-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group cursor-pointer"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-gold-100 to-gold-200 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <faq.icon className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 text-lg group-hover:text-gold-600 transition-colors duration-300">
                        {faq.question}
                      </h3>
                      <span className="text-sm text-charcoal-500 bg-sage-100 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-gold-600">
                    {openIndex === index ? (
                      <Minus className="h-6 w-6" />
                    ) : (
                      <Plus className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="divider-gold mb-4"></div>
                      <p className="text-charcoal-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="card-luxury max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              <h3 className="heading-sm">Still Have Questions?</h3>
              <p className="text-luxury">
                Our education consultants are here to help. Schedule a free consultation to discuss 
                your specific needs and get personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  Schedule Consultation
                </button>
                <button className="btn-outline">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}