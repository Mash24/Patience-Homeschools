'use client'

import { motion } from 'framer-motion'
import { BookOpen, Globe, Award, CheckCircle, Star } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const curricula = [
  {
    name: 'CBC',
    fullName: 'Competency-Based Curriculum',
    description: 'Kenya\'s innovative curriculum developing key competencies and 21st-century skills.',
    icon: BookOpen,
    features: ['Holistic development', 'Competency-based assessment', 'Local context integration', 'Digital literacy focus'],
    teachers: 25,
    rating: 4.8,
  },
  {
    name: 'IGCSE',
    fullName: 'Cambridge International',
    description: 'Globally recognised qualification with flexible subject choices and university preparation.',
    icon: Globe,
    features: ['International recognition', 'Flexible subjects', 'Rigorous standards', 'University preparation'],
    teachers: 15,
    rating: 4.9,
  },
  {
    name: 'British',
    fullName: 'British National Curriculum',
    description: 'Traditional British education providing comprehensive academic foundation through A-Levels.',
    icon: Award,
    features: ['Academic rigour', 'Character development', 'GCSE & A-Level pathway', 'UK university access'],
    teachers: 10,
    rating: 4.7,
  },
]

export default function CurriculumDetails() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Programmes"
          title="Curriculum options, expertly delivered"
          description="Each programme is taught by certified specialists — not generalists. Choose the path that fits your child's goals."
        />

        <div className="space-y-8">
          {curricula.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                  <div className="w-14 h-14 rounded-xl bg-gold-50 flex items-center justify-center mb-4">
                    <item.icon className="h-7 w-7 text-gold-600" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1">{item.name}</p>
                  <h3 className="font-serif text-2xl font-semibold text-ink mb-3">{item.fullName}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-ink-muted">
                    <span>{item.teachers} teachers</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                      {item.rating}
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-ink-muted">
                        <CheckCircle className="h-4 w-4 text-sage-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
