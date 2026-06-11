'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const events = [
  {
    id: 1,
    title: 'Advanced Chemistry Lab Session',
    date: new Date(2025, 1, 15),
    time: '10:00 AM – 2:00 PM',
    location: 'Nairobi Science Centre',
    registered: 15,
    capacity: 20,
    price: 'KSh 2,500',
    type: 'Lab Session',
  },
  {
    id: 2,
    title: 'CBC Mathematics Workshop',
    date: new Date(2025, 1, 18),
    time: '9:00 AM – 12:00 PM',
    location: 'Kenyatta University',
    registered: 28,
    capacity: 30,
    price: 'KSh 1,500',
    type: 'Workshop',
  },
  {
    id: 3,
    title: 'British Literature Discussion',
    date: new Date(2025, 1, 22),
    time: '2:00 PM – 4:00 PM',
    location: 'Nairobi Library',
    registered: 22,
    capacity: 25,
    price: 'Free',
    type: 'Discussion',
  },
  {
    id: 4,
    title: 'Sports Day & Team Building',
    date: new Date(2025, 1, 25),
    time: '8:00 AM – 5:00 PM',
    location: 'Kasarani Sports Complex',
    registered: 85,
    capacity: 100,
    price: 'KSh 1,000',
    type: 'Sports',
  },
]

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function EventsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1))

  const monthEvents = events.filter(
    (e) => e.date.getMonth() === currentMonth.getMonth() && e.date.getFullYear() === currentMonth.getFullYear()
  )

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monthEvents.length === 0 ? (
            <p className="col-span-full text-center text-ink-muted py-12">No events scheduled this month.</p>
          ) : (
            monthEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">{event.type}</span>
                  <span className="text-sm font-semibold text-ink">{event.price}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-ink mb-4">{event.title}</h3>
                <div className="space-y-2 text-sm text-ink-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gold-500 shrink-0" />
                    {event.registered} / {event.capacity} registered
                  </div>
                </div>
                <button className="mt-6 w-full py-3 bg-gold-500 text-ink font-semibold rounded-full text-sm hover:bg-gold-400 transition-colors">
                  Register Interest
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
