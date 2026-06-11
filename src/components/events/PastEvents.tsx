'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Loader2 } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

interface EventItem {
  id: string
  title: string
  description?: string
  date: string
  location?: string
}

export default function PastEvents() {
  const [pastEvents, setPastEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/events')
      .then((r) => r.json())
      .then((d) => {
        const now = new Date()
        const past = (d.events || [])
          .filter((e: EventItem) => new Date(e.date) < now)
          .sort((a: EventItem, b: EventItem) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 6)
        setPastEvents(past)
      })
      .catch(() => setPastEvents([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
        </div>
      </section>
    )
  }

  if (pastEvents.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Highlights"
          title="Past events"
          description="A look at recent community gatherings and learning experiences."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-elevated p-6"
            >
              <h3 className="font-semibold text-ink mb-3">{event.title}</h3>
              <div className="space-y-2 text-sm text-ink-muted mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold-500 shrink-0" />
                  {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.location}
                  </div>
                )}
              </div>
              {event.description && (
                <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">{event.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
