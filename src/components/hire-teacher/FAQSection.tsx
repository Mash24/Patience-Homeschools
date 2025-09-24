'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Clock, 
  Shield, 
  DollarSign,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react'

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      color: "text-blue-600",
      questions: [
        {
          question: "How does the teacher matching process work?",
          answer: "Our AI-powered system analyzes your child's needs, curriculum preferences, subjects, and learning style to match you with 3 qualified teachers. We consider factors like TSC certification, experience, location, and teaching philosophy to ensure the perfect fit."
        },
        {
          question: "How long does it take to get matched with teachers?",
          answer: "We typically provide 3 teacher recommendations within 24 hours of receiving your request. Our team personally reviews each match to ensure quality and compatibility."
        },
        {
          question: "What information do I need to provide?",
          answer: "We need basic information about your child (age, grade, curriculum), subjects needed, preferred teaching mode (in-home, online, or hybrid), schedule preferences, and any specific learning goals or challenges."
        },
        {
          question: "Is there a cost to use the matching service?",
          answer: "Our teacher matching service is completely free. You only pay the teacher directly for their services. We don't charge any commission or hidden fees."
        }
      ]
    },
    {
      title: "Teachers & Quality",
      icon: Shield,
      color: "text-green-600",
      questions: [
        {
          question: "Are all teachers TSC certified?",
          answer: "Yes, all teachers on our platform are TSC (Teachers Service Commission) certified. We verify their credentials and conduct background checks before they join our network."
        },
        {
          question: "What qualifications do your teachers have?",
          answer: "Our teachers have university degrees in education or their subject areas, TSC certification, and relevant teaching experience. Many also have additional qualifications and specializations."
        },
        {
          question: "How do you ensure teacher quality?",
          answer: "We have a rigorous vetting process including credential verification, background checks, reference checks, and teaching demonstrations. We also monitor performance through parent feedback and regular reviews."
        },
        {
          question: "Can I interview teachers before choosing?",
          answer: "Absolutely! We encourage you to interview the teachers we recommend. This helps ensure compatibility and allows you to ask questions about their teaching approach and experience."
        }
      ]
    },
    {
      title: "Pricing & Payment",
      icon: DollarSign,
      color: "text-purple-600",
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
      title: "Teaching Options",
      icon: BookOpen,
      color: "text-orange-600",
      questions: [
        {
          question: "What teaching modes are available?",
          answer: "We offer three teaching modes: In-home teaching (teacher comes to your home), Online teaching (virtual lessons), and Hybrid (combination of both). You can choose what works best for your family."
        },
        {
          question: "Which curricula do you support?",
          answer: "We support CBC (Competency Based Curriculum), IGCSE, and British Curriculum. Our teachers are specialized in these curricula and understand their specific requirements."
        },
        {
          question: "Can teachers help with exam preparation?",
          answer: "Yes, many of our teachers specialize in exam preparation for KCPE, KCSE, IGCSE, and other standardized tests. They can help with study strategies, practice tests, and targeted revision."
        },
        {
          question: "Do you offer group lessons?",
          answer: "While most lessons are one-on-one, some teachers offer small group sessions for siblings or friends. This can be more cost-effective and provide peer learning opportunities."
        }
      ]
    },
    {
      title: "Support & Guarantees",
      icon: Star,
      color: "text-yellow-600",
      questions: [
        {
          question: "What if I'm not satisfied with my teacher?",
          answer: "We offer a 100% satisfaction guarantee. If you're not happy with your teacher after the first few lessons, we'll find you a replacement at no extra cost."
        },
        {
          question: "What support do you provide after matching?",
          answer: "We provide ongoing support throughout your journey. Our team is available to help with any issues, provide guidance, and ensure your child's learning experience is successful."
        },
        {
          question: "Can I change teachers if needed?",
          answer: "Yes, you can request a teacher change at any time. We understand that sometimes personalities or teaching styles don't match, and we're happy to find you a better fit."
        },
        {
          question: "Do you offer progress tracking?",
          answer: "Many teachers provide progress reports and regular updates on your child's development. We also encourage regular communication between parents and teachers."
        }
      ]
    }
  ]

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant answers to your questions",
      action: "Start Chat",
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      action: "+254 700 000 000",
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us your detailed questions",
      action: "info@nelimaclearning.co.ke",
      color: "text-purple-600"
    }
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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our teacher matching service, 
            pricing, and how we ensure quality education for your child.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <category.icon className={`h-6 w-6 ${category.color} mr-3`} />
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-100">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 4 + itemIndex
                  const isOpen = openItems.includes(globalIndex)
                  
                  return (
                    <div key={itemIndex} className="p-6">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full text-left flex items-center justify-between group"
                      >
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors pr-4">
                          {item.question}
                        </h4>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4">
                              <p className="text-gray-600 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Our friendly team is here to help. Choose your preferred way to get in touch with us.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <method.icon className={`h-8 w-8 ${method.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold text-gray-900 mb-2">{method.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                  <div className={`text-sm font-medium ${method.color} group-hover:underline`}>
                    {method.action}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-6">
              Why Parents Choose Nelimac Learning
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold">TSC Certified</div>
                <div className="text-sm opacity-90">All Teachers</div>
              </div>
              <div>
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold">24hr Response</div>
                <div className="text-sm opacity-90">Fast Matching</div>
              </div>
              <div>
                <Star className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold">98% Success</div>
                <div className="text-sm opacity-90">Rate</div>
              </div>
              <div>
                <Users className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold">200+ Families</div>
                <div className="text-sm opacity-90">Served</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
