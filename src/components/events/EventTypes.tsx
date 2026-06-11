'use client'

import { motion } from 'framer-motion'
import { Microscope, BookOpen, Users, Trophy, Palette, Globe } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const eventTypes = [
  { name: 'Lab Sessions', icon: Microscope, description: 'Hands-on science experiments in professional laboratory settings.', count: '12+ sessions' },
  { name: 'Workshops', icon: BookOpen, description: 'Intensive learning sessions covering specific subjects and topics.', count: '20+ workshops' },
  { name: 'Study Groups', icon: Users, description: 'Collaborative sessions where students work together on projects.', count: '15+ groups' },
  { name: 'Sports & Fitness', icon: Trophy, description: 'Physical activities, competitions, and wellness programmes.', count: '8+ activities' },
  { name: 'Cultural Events', icon: Palette, description: 'Art exhibitions, performances, and creative expression.', count: '10+ events' },
  { name: 'Field Trips', icon: Globe, description: 'Educational excursions to museums, sites, and landmarks.', count: '6+ trips' },
]

export default function EventTypes() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Event Types"
          title="Something for every learner"
          description="From lab sessions to sports days — our community events enrich the homeschooling experience."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventTypes.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-elevated p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mb-5">
                <type.icon className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{type.name}</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-3">{type.description}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{type.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
