'use client'

import { motion } from 'framer-motion'
import { Download, Star, FileText, BookOpen, Video } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const resources = [
  { title: 'CBC Mathematics Mastery Guide', description: 'Step-by-step solutions and practice exercises for all CBC maths concepts.', type: 'PDF Guide', icon: FileText, downloads: '2.3k', rating: 4.9, curriculum: 'CBC' },
  { title: 'IGCSE Chemistry Lab Manual', description: '25+ experiments with safety protocols and analysis guides.', type: 'Interactive PDF', icon: BookOpen, downloads: '1.8k', rating: 4.8, curriculum: 'IGCSE' },
  { title: 'British Literature Toolkit', description: 'Literary analysis techniques and classic text study materials.', type: 'Video Series', icon: Video, downloads: '1.5k', rating: 4.9, curriculum: 'British' },
  { title: 'CBC Science Experiments', description: '50+ hands-on experiments with materials lists and learning outcomes.', type: 'Activity Pack', icon: FileText, downloads: '3.1k', rating: 4.7, curriculum: 'CBC' },
  { title: 'IGCSE Physics Problem Bank', description: '500+ problems with solutions, categorised by topic and difficulty.', type: 'Practice Set', icon: FileText, downloads: '2.0k', rating: 4.8, curriculum: 'IGCSE' },
  { title: 'Parent Homeschooling Guide', description: 'Essential strategies for successful homeschooling in Nairobi.', type: 'Parent Guide', icon: BookOpen, downloads: '2.8k', rating: 4.9, curriculum: 'All' },
]

export default function FeaturedResources() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Featured"
          title="Popular resources"
          description="Our most downloaded guides and materials, free for the community."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-elevated p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center">
                  <resource.icon className="h-5 w-5 text-gold-600" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-1 rounded-full">
                  {resource.curriculum}
                </span>
              </div>
              <h3 className="font-semibold text-ink text-sm mb-2 leading-snug">{resource.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed flex-1">{resource.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/5 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> {resource.downloads}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-gold-400 text-gold-400" /> {resource.rating}
                </span>
              </div>
              <button className="mt-4 w-full py-2.5 border border-ink/10 text-ink text-sm font-semibold rounded-full hover:border-gold-500 hover:text-gold-700 transition-colors">
                Download Free
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
