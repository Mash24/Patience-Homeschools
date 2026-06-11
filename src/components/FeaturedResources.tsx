'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, BookOpen, Award, Users, Download, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'

const resources = [
  {
    title: 'CBC Grade 6 Mathematics Guide',
    description: 'Comprehensive guide covering all CBC Grade 6 mathematics competencies.',
    type: 'PDF Guide',
    downloads: 245,
    icon: FileText,
  },
  {
    title: 'IGCSE Chemistry Lab Manual',
    description: 'Laboratory procedures and safety guidelines for IGCSE chemistry practicals.',
    type: 'Lab Manual',
    downloads: 189,
    icon: BookOpen,
  },
  {
    title: 'British Curriculum Literature',
    description: 'Analysis guides and study notes for popular literature texts.',
    type: 'Study Notes',
    downloads: 156,
    icon: Award,
  },
  {
    title: 'Homeschooling Parent Guide',
    description: 'Essential tips and strategies for successful homeschooling in Nairobi.',
    type: 'Parent Guide',
    downloads: 312,
    icon: Users,
  },
]

export default function FeaturedResources() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Resources"
          title="Free learning materials for every family"
          description="Curated guides, worksheets, and study materials designed for Nairobi's homeschooling community."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="card-elevated p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center">
                  <resource.icon className="h-5 w-5 text-gold-600" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted bg-ivory px-2 py-1 rounded-full">
                  {resource.type}
                </span>
              </div>
              <h3 className="font-semibold text-ink mb-2 text-sm leading-snug">{resource.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed flex-1">{resource.description}</p>
              <div className="flex items-center gap-1 mt-4 text-xs text-ink-muted">
                <Download className="h-3 w-3" />
                {resource.downloads} downloads
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/resources" variant="outline">
            Browse All Resources
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
