import EventsHero from '@/components/events/EventsHero'
import EventsCalendar from '@/components/events/EventsCalendar'
import EventTypes from '@/components/events/EventTypes'
import PastEvents from '@/components/events/PastEvents'
import CTA from '@/components/CTA'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <EventsHero />
      <EventsCalendar />
      <EventTypes />
      <PastEvents />
      <CTA />
    </div>
  )
}

