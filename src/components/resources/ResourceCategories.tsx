'use client'

import { motion } from 'framer-motion'
import { BookOpen, Calculator, Globe, Microscope, Palette, Music, Code, Heart } from 'lucide-react'

export default function ResourceCategories() {
  const categories = [
    {
      name: 'Mathematics',
      icon: Calculator,
      count: '120+ Resources',
      color: 'from-blue-500 to-blue-600',
      description: 'Advanced problem-solving guides, practice sheets, and interactive exercises'
    },
    {
      name: 'Languages',
      icon: BookOpen,
      count: '95+ Resources',
      color: 'from-green-500 to-green-600',
      description: 'Literature guides, grammar workbooks, and creative writing prompts'
    },
    {
      name: 'Sciences',
      icon: Microscope,
      count: '80+ Resources',
      color: 'from-purple-500 to-purple-600',
      description: 'Lab experiments, scientific method guides, and discovery activities'
    },
    {
      name: 'Social Studies',
      icon: Globe,
      count: '70+ Resources',
      color: 'from-orange-500 to-orange-600',
      description: 'History timelines, geography maps, and cultural exploration guides'
    },
    {
      name: 'Arts & Design',
      icon: Palette,
      count: '60+ Resources',
      color: 'from-pink-500 to-pink-600',
      description: 'Creative projects, art history, and design thinking activities'
    },
    {
      name: 'Music & Drama',
      icon: Music,
      count: '45+ Resources',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Musical theory, performance guides, and dramatic expression'
    },
    {
      name: 'Technology',
      icon: Code,
      count: '55+ Resources',
      color: 'from-cyan-500 to-cyan-600',
      description: 'Coding tutorials, digital literacy, and innovation projects'
    },
    {
      name: 'Life Skills',
      icon: Heart,
      count: '40+ Resources',
      color: 'from-red-500 to-red-600',
      description: 'Character development, emotional intelligence, and practical skills'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-6">
            Explore by
            <span className="text-gradient-gold"> Subject Category</span>
          </h2>
          <p className="text-luxury max-w-3xl mx-auto">
            Discover our comprehensive collection of premium educational resources, 
            carefully organized by subject to help you find exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-luxury group cursor-pointer"
            >
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-navy-900 text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-charcoal-600 mb-3">{category.count}</p>
                  <p className="text-sm text-charcoal-500 leading-relaxed">{category.description}</p>
                </div>

                <div className="pt-4">
                  <span className="inline-flex items-center text-sm font-medium text-gold-600 group-hover:text-gold-700">
                    Explore Resources
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}