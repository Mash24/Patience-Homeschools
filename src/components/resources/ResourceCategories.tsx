'use client'

import { motion } from 'framer-motion'
import { BookOpen, Calculator, Globe, Microscope, Palette, Music, Code, Heart } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const categories = [
  { name: 'Mathematics', icon: Calculator, count: '120+', description: 'Problem-solving guides and practice sheets' },
  { name: 'Languages', icon: BookOpen, count: '95+', description: 'Literature guides and writing prompts' },
  { name: 'Sciences', icon: Microscope, count: '80+', description: 'Lab experiments and discovery activities' },
  { name: 'Social Studies', icon: Globe, count: '70+', description: 'History timelines and geography maps' },
  { name: 'Arts & Design', icon: Palette, count: '60+', description: 'Creative projects and art history' },
  { name: 'Music & Drama', icon: Music, count: '45+', description: 'Theory guides and performance resources' },
  { name: 'Technology', icon: Code, count: '55+', description: 'Coding tutorials and digital literacy' },
  { name: 'Life Skills', icon: Heart, count: '40+', description: 'Wellness and personal development' },
]

export default function ResourceCategories() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by subject"
          description="Find resources organised by subject area and curriculum level."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card-elevated p-6 text-left hover:border-gold-200/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center mb-4">
                <cat.icon className="h-5 w-5 text-gold-600" />
              </div>
              <h3 className="font-semibold text-ink text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-gold-600 font-medium mb-2">{cat.count} resources</p>
              <p className="text-xs text-ink-muted leading-relaxed">{cat.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
