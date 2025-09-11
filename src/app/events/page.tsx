import EventsHero from '@/components/events/EventsHero'
import EventsCalendar from '@/components/events/EventsCalendar'
import EventTypes from '@/components/events/EventTypes'
import PastEvents from '@/components/events/PastEvents'

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <EventsHero />
      <EventsCalendar />
      <EventTypes />
      <PastEvents />
    </div>
  )
}

