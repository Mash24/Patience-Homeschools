'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Globe, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'

const curricula = [
  {
    name: 'CBC',
    fullName: 'Competency-Based Curriculum',
    description: 'Kenya\'s modern education system focused on skills, competencies, and continuous assessment.',
    icon: GraduationCap,
  },
  {
    name: 'IGCSE',
    fullName: 'Cambridge International',
    description: 'Globally recognised qualifications with flexible subject choices and university preparation.',
    icon: Globe,
  },
  {
    name: 'British',
    fullName: 'British National Curriculum',
    description: 'Structured progression through GCSE and A-Level pathways to UK universities.',
    icon: BookOpen,
  },
]

export default function CurriculaOverview() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Programmes"
          title="Expert educators across every major curriculum"
          description="Our teachers are specialists — not generalists. Each is vetted for deep subject knowledge within their curriculum."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {curricula.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated p-8 group hover:border-gold-200/60"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mb-6 group-hover:bg-gold-100 transition-colors">
                <item.icon className="h-6 w-6 text-gold-600" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-2">{item.name}</p>
              <h3 className="font-serif text-2xl font-semibold text-ink mb-3">{item.fullName}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/curricula"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors"
          >
            View all programmes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
