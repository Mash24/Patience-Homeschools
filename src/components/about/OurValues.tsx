'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Users, BookOpen, Award, Lightbulb } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const values = [
  { icon: Heart, title: 'Passion for Education', description: 'Every child deserves education that nurtures their unique potential.' },
  { icon: Shield, title: 'Trust & Safety', description: 'All teachers are TSC-certified and background-checked.' },
  { icon: Users, title: 'Community', description: 'We foster connections between families, teachers, and students.' },
  { icon: BookOpen, title: 'Teaching Excellence', description: 'Only qualified, experienced educators join our network.' },
  { icon: Award, title: 'Continuous Improvement', description: 'We evolve based on community feedback and best practices.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Modern methods and technology enhance every learning experience.' },
]

export default function OurValues() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Values"
          title="What we stand for"
          description="These principles guide every decision we make and every experience we create."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="card-elevated p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mb-5">
                <value.icon className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{value.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
