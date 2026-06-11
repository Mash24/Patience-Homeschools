'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Star } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const pastEvents = [
  {
    title: 'Advanced Physics Lab Session',
    date: 'December 15, 2023',
    location: 'Nairobi Science Centre',
    participants: 18,
    rating: 4.9,
    description: 'Hands-on experiments with advanced physics concepts including quantum mechanics and thermodynamics.',
  },
  {
    title: 'CBC Mathematics Masterclass',
    date: 'December 8, 2023',
    location: 'Kenyatta University',
    participants: 25,
    rating: 4.8,
    description: 'Comprehensive mathematics workshop covering all CBC topics with practical applications.',
  },
  {
    title: 'British Literature Discussion',
    date: 'December 1, 2023',
    location: 'Nairobi Library',
    participants: 20,
    rating: 4.9,
    description: 'In-depth discussion of classic British literature with expert analysis and interpretation.',
  },
]

export default function PastEvents() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Highlights"
          title="Past events"
          description="A glimpse of the experiences our community has enjoyed."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pastEvents.map((event, index) => (
            <motion.article
              key={event.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated p-8"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                ))}
                <span className="text-xs text-ink-muted ml-2">{event.rating}</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink mb-3">{event.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-5">{event.description}</p>
              <div className="space-y-2 text-xs text-ink-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gold-500" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-gold-500" />
                  {event.participants} participants
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
