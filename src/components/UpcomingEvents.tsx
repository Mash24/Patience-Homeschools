'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'

const events = [
  {
    title: 'CBC Science Lab Session',
    description: 'Hands-on practical experiments for CBC Grade 6–8 students.',
    date: '15 Feb 2025',
    location: 'Nairobi School, Westlands',
    spots: '25 / 30',
    type: 'Lab Session',
  },
  {
    title: 'IGCSE Mathematics Workshop',
    description: 'Advanced problem-solving and exam preparation strategies.',
    date: '20 Feb 2025',
    location: 'Online via Zoom',
    spots: '18 / 25',
    type: 'Workshop',
  },
  {
    title: 'Homeschool Sports Day',
    description: 'Annual sports day bringing together homeschooling families.',
    date: '25 Feb 2025',
    location: 'Kasarani Sports Complex',
    spots: '45 / 60',
    type: 'Community',
  },
]

export default function UpcomingEvents() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Community"
          title="Events that bring learning to life"
          description="Lab sessions, workshops, and community gatherings designed for Nairobi's homeschooling families."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event, index) => (
            <motion.article
              key={event.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated overflow-hidden group"
            >
              <div className="h-2 bg-gradient-to-r from-gold-400 to-gold-600" />
              <div className="p-8">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">
                  {event.type}
                </span>
                <h3 className="font-serif text-xl font-semibold text-ink mt-2 mb-3">{event.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-6">{event.description}</p>
                <div className="space-y-2 text-sm text-ink-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.spots} spots
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/events" variant="outline">
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
