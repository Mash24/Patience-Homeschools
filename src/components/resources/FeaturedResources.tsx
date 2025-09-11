'use client'

import { motion } from 'framer-motion'
import { Download, Star, Clock, Users, BookOpen, FileText, Video, Image } from 'lucide-react'

export default function FeaturedResources() {
  const featuredResources = [
    {
      title: 'CBC Mathematics Mastery Guide',
      description: 'Comprehensive guide covering all CBC mathematics concepts with step-by-step solutions and practice exercises.',
      type: 'PDF Guide',
      icon: FileText,
      downloads: '2.3k',
      rating: 4.9,
      curriculum: 'CBC',
      level: 'Grade 1-8',
      color: 'from-blue-500 to-blue-600',
      featured: true
    },
    {
      title: 'IGCSE Chemistry Lab Manual',
      description: 'Complete laboratory manual with 25+ experiments, safety protocols, and detailed analysis guides.',
      type: 'Interactive PDF',
      icon: BookOpen,
      downloads: '1.8k',
      rating: 4.8,
      curriculum: 'IGCSE',
      level: 'Grade 9-12',
      color: 'from-green-500 to-green-600',
      featured: true
    },
    {
      title: 'British Literature Analysis Toolkit',
      description: 'Advanced literary analysis techniques, essay writing guides, and classic text study materials.',
      type: 'Video Series',
      icon: Video,
      downloads: '1.5k',
      rating: 4.9,
      curriculum: 'British',
      level: 'A-Level',
      color: 'from-purple-500 to-purple-600',
      featured: true
    },
    {
      title: 'CBC Science Experiments Collection',
      description: '50+ hands-on science experiments with materials lists, procedures, and learning outcomes.',
      type: 'Activity Pack',
      icon: Image,
      downloads: '3.1k',
      rating: 4.7,
      curriculum: 'CBC',
      level: 'Grade 4-6',
      color: 'from-orange-500 to-orange-600',
      featured: false
    },
    {
      title: 'IGCSE Physics Problem Bank',
      description: '500+ physics problems with detailed solutions, categorized by topic and difficulty level.',
      type: 'Practice Set',
      icon: FileText,
      downloads: '2.7k',
      rating: 4.8,
      curriculum: 'IGCSE',
      level: 'Grade 10-11',
      color: 'from-cyan-500 to-cyan-600',
      featured: false
    },
    {
      title: 'British History Timeline & Maps',
      description: 'Interactive timeline and historical maps covering key periods in British history.',
      type: 'Interactive Resource',
      icon: Image,
      downloads: '1.9k',
      rating: 4.6,
      curriculum: 'British',
      level: 'GCSE',
      color: 'from-red-500 to-red-600',
      featured: false
    }
  ]

  return (
    <section className="py-24 bg-sage-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-6">
            Featured
            <span className="text-gradient-gold"> Premium Resources</span>
          </h2>
          <p className="text-luxury max-w-3xl mx-auto">
            Discover our most popular and highly-rated educational resources, 
            handpicked by our expert team for their exceptional quality and effectiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-luxury group cursor-pointer relative"
            >
              {resource.featured && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 px-3 py-1 rounded-full text-xs font-bold shadow-gold">
                  FEATURED
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} group-hover:scale-110 transition-transform duration-300`}>
                    <resource.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-gold-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">{resource.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-navy-900 text-lg mb-2 group-hover:text-gold-600 transition-colors duration-300">
                    {resource.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed mb-4">
                    {resource.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-charcoal-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{resource.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{resource.downloads}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-navy-100 text-navy-800 text-xs font-medium rounded-full">
                      {resource.curriculum}
                    </span>
                    <span className="px-2 py-1 bg-sage-100 text-sage-800 text-xs font-medium rounded-full">
                      {resource.level}
                    </span>
                  </div>
                  
                  <button className="btn-primary text-sm py-2 px-4 group-hover:scale-105 transition-transform duration-300">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-outline">
            View All Resources
          </button>
        </div>
      </div>
    </section>
  )
}
