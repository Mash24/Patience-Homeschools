'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, Download, Calendar, BookOpen, Users, Award } from 'lucide-react'

const resources = [
  {
    title: 'CBC Grade 6 Mathematics Guide',
    description: 'Comprehensive guide covering all CBC Grade 6 mathematics competencies with practice exercises.',
    type: 'PDF Guide',
    downloads: 245,
    date: '2024-01-15',
    icon: FileText,
    color: 'blue'
  },
  {
    title: 'IGCSE Chemistry Lab Manual',
    description: 'Step-by-step laboratory procedures and safety guidelines for IGCSE chemistry practicals.',
    type: 'Lab Manual',
    downloads: 189,
    date: '2024-01-10',
    icon: BookOpen,
    color: 'green'
  },
  {
    title: 'British Curriculum English Literature',
    description: 'Analysis guides and study notes for popular British curriculum literature texts.',
    type: 'Study Notes',
    downloads: 156,
    date: '2024-01-08',
    icon: Award,
    color: 'purple'
  },
  {
    title: 'Homeschooling Parent Guide',
    description: 'Essential tips and strategies for successful homeschooling in Nairobi.',
    type: 'Parent Guide',
    downloads: 312,
    date: '2024-01-05',
    icon: Users,
    color: 'orange'
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
}

export default function FeaturedResources() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Free Learning Resources
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access our growing library of free educational materials, guides, and resources 
            designed specifically for Nairobi's homeschooling community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              {/* Resource Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[resource.color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform duration-300`}>
                  <resource.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {resource.type}
                </span>
              </div>

              {/* Resource Content */}
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-tight">
                {resource.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                {resource.description}
              </p>

              {/* Resource Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3 sm:mb-4">
                <div className="flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span className="truncate">{resource.downloads} downloads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span className="truncate">{new Date(resource.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
                </div>
              </div>

              {/* Download Button */}
              <button className="w-full btn-outline text-xs sm:text-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 whitespace-nowrap">
                Download Free
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All Resources CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <Link href="/resources" className="btn-primary text-xs sm:text-sm">
            View All Resources
          </Link>
        </motion.div>

        {/* Resource Categories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 md:mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Resource Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {['CBC Materials', 'IGCSE Resources', 'British Curriculum', 'Parent Guides', 'Lab Manuals', 'Study Notes', 'Worksheets', 'Assessment Tools'].map((category, index) => (
                <div key={category} className="text-center p-3 sm:p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-300">
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
