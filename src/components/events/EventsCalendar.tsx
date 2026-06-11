'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import EventRegisterModal from '@/components/events/EventRegisterModal'

interface EventItem {
  id: string
  title: string
  description?: string
  event_type: string
  date: string
  location?: string
  max_attendees?: number
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function EventsCalendar() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null)

  useEffect(() => {
    fetch('/api/content/events')
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = events.filter((e) => new Date(e.date) >= new Date())

  const monthEvents = upcoming.filter((e) => {
    const d = new Date(e.date)
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()
  })

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Calendar"
          title="Upcoming events"
          description="Register for lab sessions, workshops, and community gatherings."
        />

        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-ivory-dark transition-colors" aria-label="Previous month">
            <ChevronLeft className="h-5 w-5 text-ink" />
          </button>
          <h3 className="font-serif text-xl font-semibold text-ink">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-ivory-dark transition-colors" aria-label="Next month">
            <ChevronRight className="h-5 w-5 text-ink" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monthEvents.length === 0 ? (
              <p className="col-span-full text-center text-ink-muted py-12">
                No events scheduled this month. Check back soon or{' '}
                <Link href="/contact" className="text-gold-600 hover:text-gold-700">contact us</Link>.
              </p>
            ) : (
              monthEvents.map((event, index) => {
                const eventDate = new Date(event.date)
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-elevated p-8"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600 capitalize">
                        {event.event_type?.replace('_', ' ') || 'Event'}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-ink mb-4">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-ink-muted mb-4 line-clamp-2">{event.description}</p>
                    )}
                    <div className="space-y-2 text-sm text-ink-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gold-500 shrink-0" />
                        {eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gold-500 shrink-0" />
                        {eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
                          {event.location}
                        </div>
                      )}
                      {event.max_attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gold-500 shrink-0" />
                          Up to {event.max_attendees} attendees
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegisterEvent(event)}
                      className="mt-6 w-full py-3 bg-gold-500 text-ink font-semibold rounded-full text-sm hover:bg-gold-400 transition-colors"
                    >
                      Register interest
                    </button>
                  </motion.div>
                )
              })
            )}
          </div>
        )}
      </div>

      {registerEvent && (
        <EventRegisterModal
          event={{ id: registerEvent.id, title: registerEvent.title }}
          onClose={() => setRegisterEvent(null)}
        />
      )}
    </section>
  )
}
